const TOPICS = [
  "SQL: Window functions & ranking",
  "SQL: LAG/LEAD & period-over-period change",
  "SQL: Date bucketing & time-based analysis",
  "SQL: Cohort retention & funnel conversion",
  "Python: Merging & joining DataFrames",
  "Python: Handling missing & duplicate data",
  "Python: Apply, map & vectorized operations",
  "Python: Ranking & deduplication (latest record per group)",
  "Final Prep: Timed mixed mock"
];

const LESSONS = {
  "SQL: Window functions & ranking": {
    "subtopics": [
      {
        "name": "RANK() over an aggregate",
        "md": "**Pattern:** aggregate first (usually in a CTE), then rank the aggregated rows.\n\n```sql\nWITH totals AS (\n  SELECT customer_id, SUM(amount) AS total_amount\n  FROM transactions WHERE status='completed' GROUP BY customer_id\n)\nSELECT customer_id, total_amount,\n  RANK() OVER (ORDER BY total_amount DESC) AS rnk\nFROM totals;\n```\n\n`RANK()` leaves gaps after ties (1,1,3); `DENSE_RANK()` doesn't (1,1,2). Say out loud which one you're picking and why \u2014 interviewers care about that distinction more than the syntax.\n\n**Second example:** rank products by total completed revenue, but use `DENSE_RANK()` instead - notice the difference from `RANK()` only shows up when there's an actual tie.\n\n```sql\nWITH totals AS (SELECT product_id, SUM(amount) AS rev FROM transactions WHERE status='completed' GROUP BY product_id)\nSELECT product_id, rev, DENSE_RANK() OVER (ORDER BY rev DESC) AS rnk FROM totals;\n```\n\n**Why this matters at PayPal:** this is how you'd answer \"who are our top-N highest-lifetime-value merchants or customers this quarter?\" - the leaderboard risk and account-management teams pull to prioritize outreach."
      },
      {
        "name": "ROW_NUMBER() partitioned by group",
        "md": "`ROW_NUMBER()` gives every row in a partition a unique, gapless number \u2014 even when values tie. Use `PARTITION BY` to restart the count per group.\n\n```sql\nSELECT customer_id, transaction_id, txn_date,\n  ROW_NUMBER() OVER (PARTITION BY customer_id ORDER BY txn_date) AS txn_seq\nFROM transactions WHERE status='completed';\n```\n\nThis is the workhorse for \"nth row per group\" questions: first order, second order, most recent, etc.\n\n**Second example:** flip the partition key - number each *product's* transactions by size instead of each *customer's* transactions by date.\n\n```sql\nSELECT product_id, transaction_id, amount,\n  ROW_NUMBER() OVER (PARTITION BY product_id ORDER BY amount DESC) AS size_rank\nFROM transactions WHERE status='completed';\n```\n\n**Why this matters at PayPal:** this is how you'd reconstruct \"what order did this customer's payments happen in?\" - the backbone of a transaction timeline view during a fraud investigation or support case."
      },
      {
        "name": "Filtering to the latest row per group",
        "md": "SQL can't filter directly on a window function in the same `SELECT` (window functions run *after* `WHERE`). Wrap it in a subquery or CTE and filter the outer query instead.\n\n```sql\nSELECT * FROM (\n  SELECT *, ROW_NUMBER() OVER (PARTITION BY customer_id ORDER BY txn_date DESC) AS rn\n  FROM transactions WHERE status='completed'\n) t WHERE rn = 1;\n```\n\nThis \"latest record per key\" pattern shows up constantly \u2014 dedup, most-recent-status, last-touch attribution.\n\n**Second example:** the same shape answers the opposite question too - each customer's *first* event ever (not their latest transaction). Just flip `DESC` to `ASC` and swap the source table.\n\n```sql\nSELECT customer_id, event_type, event_date FROM (\n  SELECT *, ROW_NUMBER() OVER (PARTITION BY customer_id ORDER BY event_date ASC) AS rn FROM events\n) e WHERE rn=1;\n```\n\n**Why this matters at PayPal:** this answers \"what is each customer's most recent transaction?\" - the query behind any current-account-status or last-activity view."
      }
    ]
  },
  "SQL: LAG/LEAD & period-over-period change": {
    "subtopics": [
      {
        "name": "LAG() to pull the previous row",
        "md": "`LAG(col) OVER (PARTITION BY ... ORDER BY ...)` reaches back one row within a partition; `LEAD()` reaches forward. The first row in each partition has no predecessor, so `LAG` returns `NULL` there \u2014 that's expected, not a bug.\n\n```sql\nSELECT customer_id, txn_date, amount,\n  LAG(amount) OVER (PARTITION BY customer_id ORDER BY txn_date) AS prev_amount\nFROM transactions WHERE status='completed';\n```\n\n**Second example:** `LEAD()` is the mirror image of `LAG()` - it reaches *forward* instead of back. Here it pulls each event's next event date, so the last event per customer correctly shows `NULL`.\n\n```sql\nSELECT customer_id, event_type, event_date,\n  LEAD(event_date) OVER (PARTITION BY customer_id ORDER BY event_date) AS next_event_date\nFROM events ORDER BY customer_id, event_date;\n```\n\n**Why this matters at PayPal:** this is how you'd check \"how does this payment compare to the customer's last one?\" - a basic building block of anomaly and fraud detection."
      },
      {
        "name": "Computing change with arithmetic on window functions",
        "md": "Window functions are just expressions \u2014 you can do arithmetic directly on them.\n\n```sql\nSELECT customer_id, txn_date, amount,\n  amount - LAG(amount) OVER (PARTITION BY customer_id ORDER BY txn_date) AS amount_change\nFROM transactions WHERE status='completed';\n```\n\nSame trick works for `LEAD(amount) - amount` (change to the *next* period) or dividing instead of subtracting for percent change.\n\n**Second example:** swap subtraction for division to get *percent* change instead of absolute change - same pattern, different arithmetic.\n\n```sql\nSELECT customer_id, txn_date, amount,\n  ROUND(100.0*(amount - LAG(amount) OVER (PARTITION BY customer_id ORDER BY txn_date))\n    / LAG(amount) OVER (PARTITION BY customer_id ORDER BY txn_date), 1) AS pct_change\nFROM transactions WHERE status='completed';\n```\n\n**Why this matters at PayPal:** this answers \"is this customer's spend trending up or down, transaction over transaction?\" - a signal that feeds churn-risk or upsell scoring."
      },
      {
        "name": "Filtering the output of a window function via CTE",
        "md": "Same rule as ranking: you can't put a window-function column in a `WHERE` clause directly. Compute it in a CTE, then filter the CTE.\n\n```sql\nWITH changes AS (\n  SELECT customer_id, txn_date, amount,\n    amount - LAG(amount) OVER (PARTITION BY customer_id ORDER BY txn_date) AS amount_change\n  FROM transactions WHERE status='completed'\n)\nSELECT * FROM changes WHERE amount_change > 100;\n```\n\n**Second example:** same CTE-then-filter shape, but looking for the opposite signal - transactions where spend *dropped* compared to the customer's previous one.\n\n```sql\nWITH changes AS (\n  SELECT customer_id, txn_date, amount,\n    100.0*(amount - LAG(amount) OVER (PARTITION BY customer_id ORDER BY txn_date))\n      / LAG(amount) OVER (PARTITION BY customer_id ORDER BY txn_date) AS pct_change\n  FROM transactions WHERE status='completed'\n)\nSELECT * FROM changes WHERE pct_change < 0;\n```\n\n**Why this matters at PayPal:** this is exactly how you'd implement \"flag any transaction where the amount jumped more than $100 versus this customer's usual pattern\" - a simple rule-based fraud alert."
      }
    ]
  },
  "SQL: Date bucketing & time-based analysis": {
    "subtopics": [
      {
        "name": "Bucketing dates with strftime",
        "md": "SQLite's `strftime('%Y-%m', date_col)` truncates a date down to a month bucket (a string like `'2024-05'`). This is the SQLite equivalent of `DATE_TRUNC('month', ...)` in Postgres.\n\n```sql\nSELECT transaction_id, txn_date, strftime('%Y-%m', txn_date) AS txn_month\nFROM transactions WHERE status='completed';\n```\n\n**Second example:** the same function buckets to any granularity - year instead of month, applied to a different date column entirely.\n\n```sql\nSELECT customer_id, signup_date, strftime('%Y', signup_date) AS signup_year FROM customers;\n```\n\n**Why this matters at PayPal:** almost every monthly reporting or trend dashboard starts with \"what month did this transaction happen in?\" - this is that first step."
      },
      {
        "name": "Aggregating by date bucket",
        "md": "Once you have a bucket column, `GROUP BY` it like any other column \u2014 the bucketing happens in the `SELECT`, the trend happens in the `GROUP BY`.\n\n```sql\nSELECT strftime('%Y-%m', txn_date) AS txn_month,\n  COUNT(*) AS n_txns, SUM(amount) AS total_amount\nFROM transactions WHERE status='completed'\nGROUP BY txn_month ORDER BY txn_month;\n```\n\n**Second example:** the same GROUP BY-a-bucket shape works on signups, not just transactions - a quick way to sanity-check whether customer acquisition is growing or shrinking month over month.\n\n```sql\nSELECT strftime('%Y-%m', signup_date) AS signup_month, COUNT(*) AS n_signups\nFROM customers GROUP BY signup_month ORDER BY signup_month;\n```\n\n**Why this matters at PayPal:** this answers \"is transaction volume or revenue trending up or down month over month?\" - the core input to the growth/revenue dashboard leadership reviews."
      },
      {
        "name": "Measuring gaps between events with julianday",
        "md": "`julianday(date)` converts a date to a floating-point day count, so subtracting two of them gives you a day gap directly.\n\n```sql\nWITH signup AS (SELECT customer_id, event_date FROM events WHERE event_type='signup'),\n     first_pay AS (SELECT customer_id, MIN(event_date) AS fp_date FROM events WHERE event_type='first_payment' GROUP BY customer_id)\nSELECT s.customer_id,\n  CAST(julianday(f.fp_date) - julianday(s.event_date) AS INTEGER) AS days_to_first_payment\nFROM signup s JOIN first_pay f ON f.customer_id = s.customer_id;\n```\n\nThis two-CTE-join shape (one event type joined to another by customer) is the core building block of funnel/time-to-convert analysis.\n\n**Second example:** the same two-CTE-join shape measures a *different* gap - time from first payment to repeat payment (i.e., how long it takes a customer to come back), not just signup-to-first-payment.\n\n```sql\nWITH fp AS (SELECT customer_id, MIN(event_date) AS fp_date FROM events WHERE event_type='first_payment' GROUP BY customer_id),\n     rp AS (SELECT customer_id, MIN(event_date) AS rp_date FROM events WHERE event_type='repeat_payment' GROUP BY customer_id)\nSELECT f.customer_id,\n  CAST(julianday(r.rp_date) - julianday(f.fp_date) AS INTEGER) AS days_fp_to_rp\nFROM fp f JOIN rp r ON r.customer_id = f.customer_id;\n```\n\n**Why this matters at PayPal:** this measures \"how long does it take a new signup to make their first payment?\" - a core activation-speed metric product teams watch to catch onboarding friction."
      }
    ]
  },
  "SQL: Cohort retention & funnel conversion": {
    "subtopics": [
      {
        "name": "Assigning a cohort from a date column",
        "md": "A \"cohort\" is just a date bucket applied to the moment a customer *entered* \u2014 usually signup date. Reuse the `strftime` trick from the previous topic.\n\n```sql\nSELECT customer_id, signup_date, strftime('%Y-%m', signup_date) AS signup_cohort\nFROM customers;\n```\n\n**Second example:** cohorts don't have to be monthly - here's a quarter-level cohort, built by combining the year with a computed quarter number from the month.\n\n```sql\nSELECT customer_id, signup_date,\n  strftime('%Y', signup_date) || '-Q' || ((CAST(strftime('%m', signup_date) AS INTEGER)-1)/3 + 1) AS signup_quarter\nFROM customers;\n```\n\n**Why this matters at PayPal:** this is the first step of any retention analysis - \"group customers by signup month so we can compare how each cohort behaves over time.\""
      },
      {
        "name": "Cohort-level conversion with LEFT JOIN",
        "md": "To get a conversion rate per cohort: build the cohort assignment, build the set of customers who *did* convert, `LEFT JOIN` them together (so non-converters stay in with `NULL`), then aggregate.\n\n```sql\nWITH cohorts AS (SELECT customer_id, strftime('%Y-%m', signup_date) AS signup_cohort FROM customers),\n     repeats AS (SELECT DISTINCT customer_id FROM events WHERE event_type='repeat_payment')\nSELECT c.signup_cohort, COUNT(*) AS cohort_size,\n  SUM(CASE WHEN r.customer_id IS NOT NULL THEN 1 ELSE 0 END) AS repeat_payers\nFROM cohorts c LEFT JOIN repeats r ON r.customer_id = c.customer_id\nGROUP BY c.signup_cohort;\n```\n\nThe `LEFT JOIN` is the whole trick \u2014 an inner join would silently drop the non-converters and inflate your rate.\n\n**Second example:** the exact same LEFT JOIN shape works for any grouping dimension, not just signup-month cohorts - here it's first-payment conversion rate by acquisition channel.\n\n```sql\nWITH ch AS (SELECT customer_id, acquisition_channel FROM customers),\n     fp AS (SELECT DISTINCT customer_id FROM events WHERE event_type='first_payment')\nSELECT c.acquisition_channel, COUNT(*) AS n_customers,\n  SUM(CASE WHEN f.customer_id IS NOT NULL THEN 1 ELSE 0 END) AS converted\nFROM ch c LEFT JOIN fp f ON f.customer_id = c.customer_id\nGROUP BY c.acquisition_channel;\n```\n\n**Why this matters at PayPal:** this answers \"what percent of each signup cohort becomes a repeat payer?\" - a standard stickiness metric used to judge whether an onboarding or product change actually worked."
      },
      {
        "name": "Full funnel counts with conditional COUNT DISTINCT",
        "md": "When every funnel stage is a row in one long `event_type` column (not separate tables), you can get every stage's count in a single pass with conditional `COUNT(DISTINCT CASE WHEN ...)`.\n\n```sql\nSELECT\n  COUNT(DISTINCT CASE WHEN event_type='signup' THEN customer_id END) AS signup,\n  COUNT(DISTINCT CASE WHEN event_type='activated' THEN customer_id END) AS activated,\n  COUNT(DISTINCT CASE WHEN event_type='first_payment' THEN customer_id END) AS first_payment,\n  COUNT(DISTINCT CASE WHEN event_type='repeat_payment' THEN customer_id END) AS repeat_payment\nFROM events;\n```\n\n`DISTINCT` inside the `CASE` matters \u2014 without it you'd double-count customers with multiple events of the same type.\n\n**Second example:** add a `JOIN` + `WHERE` to scope the exact same funnel query down to one segment - here, just Enterprise customers - to compare funnel health across segments.\n\n```sql\nSELECT\n  COUNT(DISTINCT CASE WHEN e.event_type='signup' THEN e.customer_id END) AS signup,\n  COUNT(DISTINCT CASE WHEN e.event_type='activated' THEN e.customer_id END) AS activated,\n  COUNT(DISTINCT CASE WHEN e.event_type='first_payment' THEN e.customer_id END) AS first_payment,\n  COUNT(DISTINCT CASE WHEN e.event_type='repeat_payment' THEN e.customer_id END) AS repeat_payment\nFROM events e JOIN customers c ON c.customer_id = e.customer_id\nWHERE c.segment='Enterprise';\n```\n\n**Why this matters at PayPal:** this answers \"where are we losing the most customers - signup, activation, first payment, or repeat payment?\" - exactly the funnel view growth teams use to decide where to focus."
      }
    ]
  },
  "Python: Merging & joining DataFrames": {
    "subtopics": [
      {
        "name": "merge() basics (left join)",
        "md": "`df.merge(other, on='key', how='left')` is pandas' `JOIN`. `how='left'` keeps every row of the left frame, filling unmatched right-side columns with `NaN` \u2014 same semantics as SQL's `LEFT JOIN`.\n\n```python\ntransactions.merge(products, on='product_id', how='left')\n```\n\n**Second example:** the same left-merge pattern works with any lookup table - here pulling in customer attributes (country, segment) instead of product attributes.\n\n```python\ntransactions.merge(customers, on='customer_id', how='left')\n```\n\n**Why this matters at PayPal:** almost every reporting query needs a human-readable label attached to a transaction - \"what product did this transaction relate to?\" - and this merge is how you attach it."
      },
      {
        "name": "Merge then filter then groupby",
        "md": "The three pandas verbs chain left to right just like SQL reads bottom to top: join first to pull in the column you need, filter next, aggregate last.\n\n```python\n(transactions\n  .merge(products, on='product_id', how='left')\n  .query(\"status=='completed'\")\n  .groupby('category', as_index=False)['amount'].sum())\n```\n\n**Second example:** swap the grouping column - same merge/filter/groupby chain, but slicing revenue by customer country instead of product category.\n\n```python\n(transactions\n  .merge(customers, on='customer_id', how='left')\n  .query(\"status=='completed'\")\n  .groupby('country', as_index=False)['amount'].sum())\n```\n\n**Why this matters at PayPal:** this answers \"which product category is driving the most completed revenue?\" - informs where the payments product team invests next."
      },
      {
        "name": "Anti-joins with indicator=True",
        "md": "pandas has no dedicated \"anti-join\" \u2014 you fake it with `indicator=True`, which adds a `_merge` column (`'left_only'`, `'right_only'`, `'both'`), then filter to `'left_only'`.\n\n```python\ncustomers.merge(transactions, on='customer_id', how='left', indicator=True) \\\n  .query(\"_merge=='left_only'\")['customer_id'].nunique()\n```\n\nThis answers \"which customers have never done X\" \u2014 a very common real-world ask.\n\n**Second example:** the identical indicator=True pattern answers 'customers who never had *any* event at all' just by pointing it at the events table instead of transactions.\n\n```python\ncustomers.merge(events, on='customer_id', how='left', indicator=True) \\\n  .query(\"_merge=='left_only'\")['customer_id'].nunique()\n```\n\n**Why this matters at PayPal:** this produces exactly the list a re-engagement campaign would target - \"which signed-up customers have never actually transacted?\""
      }
    ]
  },
  "Python: Handling missing & duplicate data": {
    "subtopics": [
      {
        "name": "Finding duplicate rows",
        "md": "`.duplicated()` flags every row that is an exact repeat of an earlier row (`True` from the second occurrence onward); `.sum()` counts them.\n\n```python\ntransactions.duplicated().sum()\n```\n\nAlways check this on a raw dataset before you trust any downstream aggregate \u2014 one duplicated row is a small but real source of double-counted revenue.\n\n**Second example:** run the same check on a table that *shouldn't* have duplicates - a clean result (0) is itself useful information, confirming customers is one-row-per-customer.\n\n```python\ncustomers.duplicated().sum()\n```\n\n**Why this matters at PayPal:** this is a basic data-quality check - \"is our transaction data double-counting any payments?\" - that protects revenue reporting from being silently inflated."
      },
      {
        "name": "Removing duplicates safely",
        "md": "`.drop_duplicates()` keeps the first occurrence of each unique row by default. Prefer it over manual index-dropping \u2014 it's declarative and survives re-runs on refreshed data.\n\n```python\ntransactions.drop_duplicates().shape[0]\n```\n\n**Second example:** `subset=` limits the duplicate check to specific columns instead of the whole row - here, counting unique customer-product pairs rather than removing exact duplicate rows.\n\n```python\ntransactions.drop_duplicates(subset=['customer_id','product_id']).shape[0]\n```\n\n**Why this matters at PayPal:** once duplicates are found, this is how you'd produce \"a clean transaction count I can actually trust for reporting.\""
      },
      {
        "name": "Preserving zero-count groups with left-merge + fillna",
        "md": "A plain `groupby` silently drops groups with zero matching rows (a customer with zero completed transactions just never appears). To keep every group, start from the full key list and left-merge the aggregate onto it, then `fillna(0)`.\n\n```python\ncustomers[['customer_id']].merge(\n  transactions.query(\"status=='completed'\").groupby('customer_id', as_index=False)['amount'].sum(),\n  on='customer_id', how='left'\n).fillna({'amount': 0})\n```\n\nThis is the single most common source of a subtly wrong \"average per customer\" \u2014 silently excluding the zeros instead of including them.\n\n**Second example:** same left-merge-then-fillna shape, applied to products instead of customers - completed transaction *count* per product, including any product with zero completed sales.\n\n```python\nproducts[['product_id']].merge(\n  transactions.query(\"status=='completed'\").groupby('product_id', as_index=False).size(),\n  on='product_id', how='left'\n).fillna({'size': 0})\n```\n\n**Why this matters at PayPal:** this answers \"what's the average revenue per customer, including customers who haven't transacted yet?\" - getting this wrong by silently dropping the zeros is a classic way an average ends up inflated in a business review."
      }
    ]
  },
  "Python: Apply, map & vectorized operations": {
    "subtopics": [
      {
        "name": "np.where for binary flags",
        "md": "`np.where(condition, value_if_true, value_if_false)` is a vectorized `if/else` \u2014 it runs at C speed across the whole column instead of once per row.\n\n```python\ntransactions.assign(\n  high_value=np.where(transactions['amount'] > 200, 'high_value', 'standard')\n)\n```\n\n**Second example:** the same np.where shape works on a text condition, not just a numeric threshold - flagging failed/refunded transactions using `.isin()` inside the condition.\n\n```python\ntransactions.assign(\n  status_flag=np.where(transactions['status'].isin(['failed','refunded']), 'failed_or_refunded', 'other')\n)\n```\n\n**Why this matters at PayPal:** this is how you'd implement \"flag high-value transactions for extra fraud review\" - a simple rule-based tiering step that feeds a risk queue."
      },
      {
        "name": "np.select for multi-way buckets",
        "md": "`np.select(conditions_list, choices_list, default=...)` extends `np.where` to more than two branches \u2014 pass a list of boolean conditions and a matching list of outputs, evaluated in order.\n\n```python\nnp.select(\n  [transactions['amount'] < 50, transactions['amount'] < 200],\n  ['small', 'medium'],\n  default='large'\n)\n```\n\n**Second example:** np.select's conditions don't have to be numeric ranges - here it's a categorical membership check building a two-region bucket from country.\n\n```python\nmerged = transactions.merge(customers[['customer_id','country']], on='customer_id', how='left')\nmerged.assign(region=np.select([merged['country']=='USA'], ['Americas'], default='Europe'))\n```\n\n**Why this matters at PayPal:** this answers \"bucket transactions into small/medium/large tiers for reporting or pricing\" - multi-tier segmentation shows up constantly in payments analytics."
      },
      {
        "name": "Vectorizing a conditional adjustment (vs .apply)",
        "md": "`.apply(lambda row: ..., axis=1)` re-runs a Python function once per row \u2014 correct but slow. When the logic is a simple condition on one or two columns, `np.where`/`np.select` do the same thing at native speed. In an interview, mention both: `.apply` is more flexible (arbitrary logic, multiple columns), vectorized ops are faster and preferred whenever the logic fits.\n\n```python\ntransactions.merge(customers[['customer_id','segment']], on='customer_id', how='left').assign(\n  adj_amount=lambda d: np.where(d['segment'] == 'Enterprise', d['amount'] * 0.9, d['amount'])\n)\n```\n\n**Second example:** same vectorized-adjustment shape, different business rule - a 5% referral bonus added on top of the amount for customers acquired via referral.\n\n```python\ntransactions.merge(customers[['customer_id','acquisition_channel']], on='customer_id', how='left').assign(\n  adj_amount=lambda d: np.where(d['acquisition_channel']=='Referral', d['amount']*1.05, d['amount'])\n)\n```\n\n**Why this matters at PayPal:** this is how you'd apply a business rule like \"give our Enterprise-tier customers a loyalty discount\" - fast enough to run across millions of transactions instead of row by row."
      }
    ]
  },
  "Python: Ranking & deduplication (latest record per group)": {
    "subtopics": [
      {
        "name": "rank() within a group",
        "md": "`.groupby('key')['col'].rank(method='min', ascending=False)` ranks values *within* each group \u2014 the pandas equivalent of SQL's `RANK() OVER (PARTITION BY ...)`. `method='min'` matches SQL `RANK()`'s tie behavior (gaps after ties); `method='dense'` matches `DENSE_RANK()`.\n\n```python\ntransactions.query(\"status=='completed'\").assign(\n  rnk=lambda d: d.groupby('customer_id')['amount'].rank(method='min', ascending=False)\n)\n```\n\n**Second example:** switch `method='min'` to `method='first'` to get gapless, unique ranks even on ties (the pandas equivalent of ROW_NUMBER instead of RANK) - here numbering each customer's transactions in date order.\n\n```python\ntransactions.query(\"status=='completed'\").assign(\n  txn_order=lambda d: d.groupby('customer_id')['txn_date'].rank(method='first')\n)\n```\n\n**Why this matters at PayPal:** this answers \"rank each customer's own transactions by size\" - used to surface a customer's single largest payment for review or highlight it in an account summary."
      },
      {
        "name": "Latest-per-group via sort + groupby.tail",
        "md": "Sort so the row you want is last within each group, then `.groupby('key').tail(1)` grabs it. Straightforward and very readable \u2014 usually the first approach worth reaching for.\n\n```python\ntransactions.query(\"status=='completed'\").sort_values('txn_date').groupby('customer_id').tail(1)\n```\n\n**Second example:** `.head(1)` instead of `.tail(1)` flips this from 'latest per group' to 'earliest per group' - each customer's very first event.\n\n```python\nevents.sort_values('event_date').groupby('customer_id').head(1)\n```\n\n**Why this matters at PayPal:** same business need as the SQL 'latest transaction per customer' question - just solved from the pandas/analytics side of the stack."
      },
      {
        "name": "Latest-per-group via drop_duplicates(keep='last')",
        "md": "Same result, different tool: sort by the tiebreaker column, then `drop_duplicates(subset='key', keep='last')` keeps only the last row per key. Interviewers sometimes ask for both so they can see you know they're equivalent.\n\n```python\ntransactions.query(\"status=='completed'\").sort_values('txn_date') \\\n  .drop_duplicates(subset='customer_id', keep='last')\n```\n\n**Second example:** likewise, `keep='first'` instead of `keep='last'` gives the earliest row per group with drop_duplicates - same trick, opposite end.\n\n```python\nevents.sort_values('event_date').drop_duplicates(subset='customer_id', keep='first')\n```\n\n**Why this matters at PayPal:** interviewers often want to see you have more than one tool for the same common business ask - here, 'the latest record per customer' solved a second way."
      }
    ]
  },
  "Final Prep: Timed mixed mock": {
    "subtopics": [
      {
        "name": "Mock Q1 (SQL, easy) \u2014 warm-up join + count",
        "md": "Treat this section as a timed mock, not a lesson: set a timer, narrate out loud as if Carlos (or any interviewer) is listening, and don't peek at hints unless you're truly stuck. This first question is a straightforward join-and-count \u2014 the kind of thing that should take under 3 minutes including narration."
      },
      {
        "name": "Mock Q2 (pandas, medium) \u2014 merge, aggregate, sort, head",
        "md": "A realistic HackerRank-style ask: join two tables, aggregate, then rank and take the top N. Narrate your plan before you type: what you're joining, on what key, what you're aggregating, how you're limiting to the top rows."
      },
      {
        "name": "Mock Q3 (SQL, hard) \u2014 combine two patterns into one query",
        "md": "This closing question deliberately combines two things you practiced separately: a \"latest row per group\" window function and a LAG-based day-gap calculation, in a single query. Real interviews often escalate difficulty this way \u2014 by asking you to compose two things you already know rather than teaching a brand-new concept."
      }
    ]
  }
};

const QUESTIONS = [
  {
    "diff": "easy",
    "type": "sql",
    "ask": "Rank customers by their total completed-transaction amount, highest first, using RANK(). Return customer_id, total_amount, rnk.",
    "hint": "Aggregate into a CTE first (SUM(amount) GROUP BY customer_id, filtered to status='completed'), then RANK() OVER (ORDER BY total_amount DESC) on the CTE.",
    "solution": "WITH totals AS (\n  SELECT customer_id, SUM(amount) AS total_amount\n  FROM transactions WHERE status='completed' GROUP BY customer_id\n)\nSELECT customer_id, total_amount, RANK() OVER (ORDER BY total_amount DESC) AS rnk\nFROM totals ORDER BY rnk;",
    "ordered": false,
    "bonus": false,
    "id": 0,
    "topic": "SQL: Window functions & ranking",
    "subtopic": "RANK() over an aggregate"
  },
  {
    "diff": "easy",
    "type": "sql",
    "ask": "Rank customers by their number of completed transactions (not total amount) using RANK(). Return customer_id, n_txns, rnk.",
    "hint": "Same shape as the last question - just aggregate a different value.",
    "solution": "WITH totals AS (\n  SELECT customer_id, COUNT(*) AS n_txns\n  FROM transactions WHERE status='completed' GROUP BY customer_id\n)\nSELECT customer_id, n_txns, RANK() OVER (ORDER BY n_txns DESC) AS rnk\nFROM totals ORDER BY rnk;",
    "ordered": false,
    "bonus": false,
    "topic": "SQL: Window functions & ranking",
    "subtopic": "RANK() over an aggregate",
    "id": 1
  },
  {
    "diff": "medium",
    "type": "sql",
    "ask": "For each customer's completed transactions, number them in chronological order starting at 1 using ROW_NUMBER(). Return customer_id, transaction_id, txn_date, txn_seq.",
    "hint": "PARTITION BY customer_id, ORDER BY txn_date, on ROW_NUMBER() OVER (...).",
    "solution": "SELECT customer_id, transaction_id, txn_date,\n  ROW_NUMBER() OVER (PARTITION BY customer_id ORDER BY txn_date) AS txn_seq\nFROM transactions WHERE status='completed' ORDER BY customer_id, txn_seq;",
    "ordered": false,
    "bonus": false,
    "id": 2,
    "topic": "SQL: Window functions & ranking",
    "subtopic": "ROW_NUMBER() partitioned by group"
  },
  {
    "diff": "medium",
    "type": "sql",
    "ask": "For each customer's completed transactions, number them from most recent to least recent (1 = most recent) using ROW_NUMBER(). Return customer_id, transaction_id, txn_date, recency_rank.",
    "hint": "Think about what changes if you flip the ORDER BY direction.",
    "solution": "SELECT customer_id, transaction_id, txn_date,\n  ROW_NUMBER() OVER (PARTITION BY customer_id ORDER BY txn_date DESC) AS recency_rank\nFROM transactions WHERE status='completed' ORDER BY customer_id, recency_rank;",
    "ordered": false,
    "bonus": false,
    "topic": "SQL: Window functions & ranking",
    "subtopic": "ROW_NUMBER() partitioned by group",
    "id": 3
  },
  {
    "diff": "hard",
    "type": "sql",
    "ask": "Return each customer's single most recent completed transaction (customer_id, transaction_id, amount, txn_date).",
    "hint": "ROW_NUMBER() OVER (PARTITION BY customer_id ORDER BY txn_date DESC) in a subquery, then filter the outer query to rn=1 - you can't filter on the window column directly in the same SELECT.",
    "solution": "SELECT customer_id, transaction_id, amount, txn_date\nFROM (\n  SELECT *, ROW_NUMBER() OVER (PARTITION BY customer_id ORDER BY txn_date DESC) AS rn\n  FROM transactions WHERE status='completed'\n) t WHERE rn=1 ORDER BY customer_id;",
    "ordered": false,
    "bonus": false,
    "id": 4,
    "topic": "SQL: Window functions & ranking",
    "subtopic": "Filtering to the latest row per group"
  },
  {
    "diff": "hard",
    "type": "sql",
    "ask": "Return each customer's single earliest completed transaction (customer_id, transaction_id, amount, txn_date) - the opposite of what you just found.",
    "hint": "Reuse the previous pattern; think about which ORDER BY direction gives you the opposite row.",
    "solution": "SELECT customer_id, transaction_id, amount, txn_date\nFROM (\n  SELECT *, ROW_NUMBER() OVER (PARTITION BY customer_id ORDER BY txn_date ASC) AS rn\n  FROM transactions WHERE status='completed'\n) t WHERE rn=1 ORDER BY customer_id;",
    "ordered": false,
    "bonus": false,
    "topic": "SQL: Window functions & ranking",
    "subtopic": "Filtering to the latest row per group",
    "id": 5
  },
  {
    "id": 6,
    "topic": "SQL: Window functions & ranking",
    "subtopic": null,
    "diff": "recall",
    "type": "written",
    "recall": true,
    "ask": "In your own words: what's the difference between RANK() and ROW_NUMBER(), and why can't you filter directly on a window function's output in the same SELECT it's computed in?",
    "hint": "Talk through it like you're explaining to a peer who knows SQL/pandas basics but hasn't seen this specific pattern - name the technique, when you'd reach for it, and one gotcha.",
    "bonus": false,
    "modelAnswer": "**RANK()** assigns the same rank to ties and leaves gaps afterward (1,1,3); **ROW_NUMBER()** always gives a unique, gapless number even for ties, so it's the right tool when you need exactly one row per group (e.g. \"the latest row\"). Window functions are evaluated *after* WHERE/GROUP BY in SQL's logical execution order, so their output column isn't available yet when WHERE runs in that same SELECT - you have to wrap the query in a subquery/CTE and filter the outer layer instead."
  },
  {
    "diff": "easy",
    "type": "sql",
    "ask": "For each customer's completed transactions, show the previous transaction's amount next to the current one, ordered by date, using LAG().",
    "hint": "LAG(amount) OVER (PARTITION BY customer_id ORDER BY txn_date) - the first row per customer will show NULL, which is correct.",
    "solution": "SELECT customer_id, transaction_id, txn_date, amount,\n  LAG(amount) OVER (PARTITION BY customer_id ORDER BY txn_date) AS prev_amount\nFROM transactions WHERE status='completed' ORDER BY customer_id, txn_date;",
    "ordered": false,
    "bonus": false,
    "id": 7,
    "topic": "SQL: LAG/LEAD & period-over-period change",
    "subtopic": "LAG() to pull the previous row"
  },
  {
    "diff": "easy",
    "type": "sql",
    "ask": "For each customer's completed transactions, show the amount from two transactions ago (not just one), ordered by date.",
    "hint": "LAG takes an optional second argument.",
    "solution": "SELECT customer_id, transaction_id, txn_date, amount,\n  LAG(amount, 2) OVER (PARTITION BY customer_id ORDER BY txn_date) AS amount_two_back\nFROM transactions WHERE status='completed' ORDER BY customer_id, txn_date;",
    "ordered": false,
    "bonus": false,
    "topic": "SQL: LAG/LEAD & period-over-period change",
    "subtopic": "LAG() to pull the previous row",
    "id": 8
  },
  {
    "diff": "medium",
    "type": "sql",
    "ask": "Extend the previous query to compute amount_change = current amount minus the previous transaction's amount, per customer.",
    "hint": "Just subtract: amount - LAG(amount) OVER (...). Window function calls can be used directly in arithmetic expressions.",
    "solution": "SELECT customer_id, transaction_id, txn_date, amount,\n  amount - LAG(amount) OVER (PARTITION BY customer_id ORDER BY txn_date) AS amount_change\nFROM transactions WHERE status='completed' ORDER BY customer_id, txn_date;",
    "ordered": false,
    "bonus": false,
    "id": 9,
    "topic": "SQL: LAG/LEAD & period-over-period change",
    "subtopic": "Computing change with arithmetic on window functions"
  },
  {
    "diff": "medium",
    "type": "sql",
    "ask": "For each customer's completed transactions, compute change_to_next: the next transaction's amount minus this one's amount.",
    "hint": "Consider using LEAD instead of LAG, and think about the order of subtraction.",
    "solution": "SELECT customer_id, txn_date, amount,\n  LEAD(amount) OVER (PARTITION BY customer_id ORDER BY txn_date) - amount AS change_to_next\nFROM transactions WHERE status='completed' ORDER BY customer_id, txn_date;",
    "ordered": false,
    "bonus": false,
    "topic": "SQL: LAG/LEAD & period-over-period change",
    "subtopic": "Computing change with arithmetic on window functions",
    "id": 10
  },
  {
    "diff": "hard",
    "type": "sql",
    "ask": "Find every completed transaction where amount_change (vs. the customer's previous transaction) was greater than 100.",
    "hint": "Compute amount_change in a CTE, then filter the CTE in the outer SELECT's WHERE clause - you can't filter on it inline.",
    "solution": "WITH changes AS (\n  SELECT customer_id, transaction_id, txn_date, amount,\n    amount - LAG(amount) OVER (PARTITION BY customer_id ORDER BY txn_date) AS amount_change\n  FROM transactions WHERE status='completed'\n)\nSELECT * FROM changes WHERE amount_change > 100 ORDER BY customer_id, txn_date;",
    "ordered": false,
    "bonus": false,
    "id": 11,
    "topic": "SQL: LAG/LEAD & period-over-period change",
    "subtopic": "Filtering the output of a window function via CTE"
  },
  {
    "diff": "hard",
    "type": "sql",
    "ask": "Using the amount_change-style CTE, return every customer's very first completed transaction (i.e. the row where there was no previous transaction to compare against).",
    "hint": "Think about what NULL means in a LAG-based column when there's nothing before it.",
    "solution": "WITH changes AS (\n  SELECT customer_id, transaction_id, txn_date, amount,\n    LAG(amount) OVER (PARTITION BY customer_id ORDER BY txn_date) AS prev_amount\n  FROM transactions WHERE status='completed'\n)\nSELECT * FROM changes WHERE prev_amount IS NULL ORDER BY customer_id;",
    "ordered": false,
    "bonus": false,
    "topic": "SQL: LAG/LEAD & period-over-period change",
    "subtopic": "Filtering the output of a window function via CTE",
    "id": 12
  },
  {
    "id": 13,
    "topic": "SQL: LAG/LEAD & period-over-period change",
    "subtopic": null,
    "diff": "recall",
    "type": "written",
    "recall": true,
    "ask": "Explain when you'd reach for LAG/LEAD instead of a self-join to compare a row to the 'previous' row, and what happens at the boundary (first row in a partition).",
    "hint": "Talk through it like you're explaining to a peer who knows SQL/pandas basics but hasn't seen this specific pattern - name the technique, when you'd reach for it, and one gotcha.",
    "bonus": false,
    "modelAnswer": "LAG/LEAD replace what used to require a self-join on a computed row-number offset by one - same result, far less SQL, and no risk of accidentally duplicating rows if the join key isn't perfectly unique. At the boundary, LAG returns NULL for the first row in each partition (there's nothing before it) and LEAD returns NULL for the last row - you generally want to keep those NULLs rather than filtering them out, since they correctly represent 'no prior period to compare against'."
  },
  {
    "diff": "easy",
    "type": "sql",
    "ask": "For each completed transaction, extract the year-month bucket (e.g. '2024-05') from txn_date.",
    "hint": "strftime('%Y-%m', txn_date) is SQLite's DATE_TRUNC equivalent.",
    "solution": "SELECT transaction_id, txn_date, strftime('%Y-%m', txn_date) AS txn_month\nFROM transactions WHERE status='completed' ORDER BY transaction_id;",
    "ordered": false,
    "bonus": false,
    "id": 14,
    "topic": "SQL: Date bucketing & time-based analysis",
    "subtopic": "Bucketing dates with strftime"
  },
  {
    "diff": "easy",
    "type": "sql",
    "ask": "For each completed transaction, extract the ISO week number from txn_date.",
    "hint": "strftime supports more format codes than just %Y-%m.",
    "solution": "SELECT transaction_id, txn_date, strftime('%W', txn_date) AS week_num\nFROM transactions WHERE status='completed' ORDER BY transaction_id;",
    "ordered": false,
    "bonus": false,
    "topic": "SQL: Date bucketing & time-based analysis",
    "subtopic": "Bucketing dates with strftime",
    "id": 15
  },
  {
    "diff": "medium",
    "type": "sql",
    "ask": "Build a monthly trend of completed transactions: for each month, the number of transactions and total amount.",
    "hint": "GROUP BY the strftime bucket you just built.",
    "solution": "SELECT strftime('%Y-%m', txn_date) AS txn_month, COUNT(*) AS n_txns, SUM(amount) AS total_amount\nFROM transactions WHERE status='completed' GROUP BY txn_month ORDER BY txn_month;",
    "ordered": true,
    "bonus": false,
    "id": 16,
    "topic": "SQL: Date bucketing & time-based analysis",
    "subtopic": "Aggregating by date bucket"
  },
  {
    "diff": "medium",
    "type": "sql",
    "ask": "Aggregate completed transactions by day of week: for each weekday, the number of transactions and total amount.",
    "hint": "Same GROUP BY shape as the monthly trend - just bucket by weekday instead.",
    "solution": "SELECT strftime('%w', txn_date) AS weekday, COUNT(*) AS n_txns, SUM(amount) AS total_amount\nFROM transactions WHERE status='completed' GROUP BY weekday ORDER BY weekday;",
    "ordered": true,
    "bonus": false,
    "topic": "SQL: Date bucketing & time-based analysis",
    "subtopic": "Aggregating by date bucket",
    "id": 17
  },
  {
    "diff": "hard",
    "type": "sql",
    "ask": "For each customer, compute the number of days between their signup event and their first_payment event (both in the events table). Return customer_id, signup_date, first_payment_date, days_to_first_payment.",
    "hint": "Build two CTEs (one per event_type), join them on customer_id, and subtract with julianday() diffs. MIN(event_date) handles any customer with multiple first_payment rows.",
    "solution": "WITH signup AS (\n  SELECT customer_id, event_date FROM events WHERE event_type='signup'\n),\nfirst_pay AS (\n  SELECT customer_id, MIN(event_date) AS first_payment_date FROM events WHERE event_type='first_payment' GROUP BY customer_id\n)\nSELECT s.customer_id, s.event_date AS signup_date, f.first_payment_date,\n  CAST(julianday(f.first_payment_date) - julianday(s.event_date) AS INTEGER) AS days_to_first_payment\nFROM signup s JOIN first_pay f ON f.customer_id = s.customer_id\nORDER BY s.customer_id;",
    "ordered": false,
    "bonus": false,
    "id": 18,
    "topic": "SQL: Date bucketing & time-based analysis",
    "subtopic": "Measuring gaps between events with julianday"
  },
  {
    "diff": "hard",
    "type": "sql",
    "ask": "For each customer, compute the number of days between their activated event and their first_payment event.",
    "hint": "Same two-CTE-join shape as before - just pick a different pair of event_types.",
    "solution": "WITH act AS (\n  SELECT customer_id, event_date FROM events WHERE event_type='activated'\n),\nfp AS (\n  SELECT customer_id, MIN(event_date) AS fp_date FROM events WHERE event_type='first_payment' GROUP BY customer_id\n)\nSELECT a.customer_id,\n  CAST(julianday(f.fp_date) - julianday(a.event_date) AS INTEGER) AS days_act_to_fp\nFROM act a JOIN fp f ON f.customer_id = a.customer_id ORDER BY a.customer_id;",
    "ordered": false,
    "bonus": false,
    "topic": "SQL: Date bucketing & time-based analysis",
    "subtopic": "Measuring gaps between events with julianday",
    "id": 19
  },
  {
    "id": 20,
    "topic": "SQL: Date bucketing & time-based analysis",
    "subtopic": null,
    "diff": "recall",
    "type": "written",
    "recall": true,
    "ask": "Why does joining two CTEs (one per event type) on customer_id, rather than self-joining the raw events table, make time-gap-between-events queries much easier to get right?",
    "hint": "Talk through it like you're explaining to a peer who knows SQL/pandas basics but hasn't seen this specific pattern - name the technique, when you'd reach for it, and one gotcha.",
    "bonus": false,
    "modelAnswer": "Filtering each event type into its own CTE first means each side of the join is already 'one row per customer for that event' (or explicitly aggregated to one, e.g. via MIN for first occurrence), so the join can't silently fan out into a cross-product of every signup row against every first_payment row. Joining the raw table directly on customer_id without pre-filtering by event_type would match every event row against every other event row for that customer, producing garbage day-gaps and duplicated counts."
  },
  {
    "diff": "easy",
    "type": "sql",
    "ask": "Assign each customer a signup_cohort bucket (year-month) based on their signup_date.",
    "hint": "Same strftime('%Y-%m', ...) trick, applied to customers.signup_date this time.",
    "solution": "SELECT customer_id, signup_date, strftime('%Y-%m', signup_date) AS signup_cohort\nFROM customers ORDER BY customer_id;",
    "ordered": false,
    "bonus": false,
    "id": 21,
    "topic": "SQL: Cohort retention & funnel conversion",
    "subtopic": "Assigning a cohort from a date column"
  },
  {
    "diff": "easy",
    "type": "sql",
    "ask": "Assign each customer a purchase_cohort (year-month) based on the date of their first completed transaction, not their signup date.",
    "hint": "Base the cohort on each customer's own transaction history instead of the customers table.",
    "solution": "WITH first_txn AS (\n  SELECT customer_id, MIN(txn_date) AS first_txn_date FROM transactions WHERE status='completed' GROUP BY customer_id\n)\nSELECT customer_id, first_txn_date, strftime('%Y-%m', first_txn_date) AS purchase_cohort\nFROM first_txn ORDER BY customer_id;",
    "ordered": false,
    "bonus": false,
    "topic": "SQL: Cohort retention & funnel conversion",
    "subtopic": "Assigning a cohort from a date column",
    "id": 22
  },
  {
    "diff": "medium",
    "type": "sql",
    "ask": "For each signup cohort, compute cohort_size and how many of those customers ever had a repeat_payment event.",
    "hint": "LEFT JOIN the cohort assignment against a DISTINCT list of repeat_payment customer_ids so non-converters stay in the result with NULL, then aggregate with a CASE WHEN.",
    "solution": "WITH cohorts AS (\n  SELECT customer_id, strftime('%Y-%m', signup_date) AS signup_cohort FROM customers\n),\nrepeats AS (\n  SELECT DISTINCT customer_id FROM events WHERE event_type='repeat_payment'\n)\nSELECT c.signup_cohort, COUNT(*) AS cohort_size,\n  SUM(CASE WHEN r.customer_id IS NOT NULL THEN 1 ELSE 0 END) AS repeat_payers\nFROM cohorts c LEFT JOIN repeats r ON r.customer_id = c.customer_id\nGROUP BY c.signup_cohort ORDER BY c.signup_cohort;",
    "ordered": true,
    "bonus": false,
    "id": 23,
    "topic": "SQL: Cohort retention & funnel conversion",
    "subtopic": "Cohort-level conversion with LEFT JOIN"
  },
  {
    "diff": "medium",
    "type": "sql",
    "ask": "For each signup cohort, compute cohort_size and how many of those customers were ever activated.",
    "hint": "Same LEFT JOIN shape as before - just swap out which event you're checking for.",
    "solution": "WITH cohorts AS (\n  SELECT customer_id, strftime('%Y-%m', signup_date) AS signup_cohort FROM customers\n),\nact AS (\n  SELECT DISTINCT customer_id FROM events WHERE event_type='activated'\n)\nSELECT c.signup_cohort, COUNT(*) AS cohort_size,\n  SUM(CASE WHEN a.customer_id IS NOT NULL THEN 1 ELSE 0 END) AS activated\nFROM cohorts c LEFT JOIN act a ON a.customer_id = c.customer_id\nGROUP BY c.signup_cohort ORDER BY c.signup_cohort;",
    "ordered": true,
    "bonus": false,
    "topic": "SQL: Cohort retention & funnel conversion",
    "subtopic": "Cohort-level conversion with LEFT JOIN",
    "id": 24
  },
  {
    "diff": "hard",
    "type": "sql",
    "ask": "Compute the full funnel: how many distinct customers reached each stage - signup, activated, first_payment, repeat_payment - across the entire events table, as one row with four columns.",
    "hint": "COUNT(DISTINCT CASE WHEN event_type='X' THEN customer_id END) once per stage, all in a single SELECT with no GROUP BY.",
    "solution": "SELECT\n  COUNT(DISTINCT CASE WHEN event_type='signup' THEN customer_id END) AS signup,\n  COUNT(DISTINCT CASE WHEN event_type='activated' THEN customer_id END) AS activated,\n  COUNT(DISTINCT CASE WHEN event_type='first_payment' THEN customer_id END) AS first_payment,\n  COUNT(DISTINCT CASE WHEN event_type='repeat_payment' THEN customer_id END) AS repeat_payment\nFROM events;",
    "ordered": false,
    "bonus": false,
    "id": 25,
    "topic": "SQL: Cohort retention & funnel conversion",
    "subtopic": "Full funnel counts with conditional COUNT DISTINCT"
  },
  {
    "diff": "hard",
    "type": "sql",
    "ask": "Compute the full funnel counts (signup/activated/first_payment/repeat_payment) scoped to customers acquired through the 'Paid' channel only.",
    "hint": "Same funnel query as before - just add a filter.",
    "solution": "SELECT\n  COUNT(DISTINCT CASE WHEN e.event_type='signup' THEN e.customer_id END) AS signup,\n  COUNT(DISTINCT CASE WHEN e.event_type='activated' THEN e.customer_id END) AS activated,\n  COUNT(DISTINCT CASE WHEN e.event_type='first_payment' THEN e.customer_id END) AS first_payment,\n  COUNT(DISTINCT CASE WHEN e.event_type='repeat_payment' THEN e.customer_id END) AS repeat_payment\nFROM events e JOIN customers c ON c.customer_id = e.customer_id\nWHERE c.acquisition_channel='Paid';",
    "ordered": false,
    "bonus": false,
    "topic": "SQL: Cohort retention & funnel conversion",
    "subtopic": "Full funnel counts with conditional COUNT DISTINCT",
    "id": 26
  },
  {
    "id": 27,
    "topic": "SQL: Cohort retention & funnel conversion",
    "subtopic": null,
    "diff": "recall",
    "type": "written",
    "recall": true,
    "ask": "Why must you use a LEFT JOIN (not an INNER JOIN) when computing a cohort's conversion rate against an event that not every customer in the cohort experienced?",
    "hint": "Talk through it like you're explaining to a peer who knows SQL/pandas basics but hasn't seen this specific pattern - name the technique, when you'd reach for it, and one gotcha.",
    "bonus": false,
    "modelAnswer": "An INNER JOIN only keeps rows that match on both sides, so any cohort member who never had the target event (e.g. never made a repeat payment) would be dropped from the result entirely - shrinking your cohort_size denominator to just the converters and making the conversion rate look artificially close to 100%. A LEFT JOIN keeps every cohort member and fills NULL for non-matches, so you can correctly count both the true cohort size and the subset that converted."
  },
  {
    "diff": "easy",
    "type": "pycalc",
    "ask": "Merge transactions with products on product_id (keep every transaction row) and assign the result to result.",
    "hint": "transactions.merge(products, on='product_id', how='left')",
    "solution": "result = transactions.merge(products, on='product_id', how='left')",
    "ordered": false,
    "bonus": false,
    "id": 28,
    "topic": "Python: Merging & joining DataFrames",
    "subtopic": "merge() basics (left join)"
  },
  {
    "diff": "easy",
    "type": "pycalc",
    "ask": "Merge the campaign table with customers on customer_id (keep every campaign row) and assign the result to result.",
    "hint": "Same merge shape as before, different pair of tables.",
    "solution": "result = campaign.merge(customers, on='customer_id', how='left')",
    "ordered": false,
    "bonus": false,
    "topic": "Python: Merging & joining DataFrames",
    "subtopic": "merge() basics (left join)",
    "id": 29
  },
  {
    "diff": "medium",
    "type": "pycalc",
    "ask": "For completed transactions only, compute total amount per product category.",
    "hint": "Merge to bring in category, .query(\"status=='completed'\"), then groupby('category')['amount'].sum().",
    "solution": "result = (transactions\n  .merge(products, on='product_id', how='left')\n  .query(\"status=='completed'\")\n  .groupby('category', as_index=False)['amount'].sum())",
    "ordered": false,
    "bonus": false,
    "id": 30,
    "topic": "Python: Merging & joining DataFrames",
    "subtopic": "Merge then filter then groupby"
  },
  {
    "diff": "medium",
    "type": "pycalc",
    "ask": "For completed transactions only, compute total amount per A/B test exp_group (from the campaign table).",
    "hint": "Same merge-filter-groupby chain as before - swap in a different lookup table and grouping column.",
    "solution": "result = (transactions\n  .merge(campaign, on='customer_id', how='left')\n  .query(\"status=='completed'\")\n  .groupby('exp_group', as_index=False)['amount'].sum())",
    "ordered": false,
    "bonus": false,
    "topic": "Python: Merging & joining DataFrames",
    "subtopic": "Merge then filter then groupby",
    "id": 31
  },
  {
    "diff": "hard",
    "type": "pycalc",
    "ask": "Count how many distinct customers have never made a single transaction (of any status).",
    "hint": "merge(..., indicator=True) adds a _merge column; filter to 'left_only' to get customers with no matching transaction row.",
    "solution": "result = customers.merge(transactions, on='customer_id', how='left', indicator=True) \\\n  .query(\"_merge=='left_only'\")['customer_id'].nunique()",
    "ordered": false,
    "bonus": false,
    "id": 32,
    "topic": "Python: Merging & joining DataFrames",
    "subtopic": "Anti-joins with indicator=True"
  },
  {
    "diff": "hard",
    "type": "pycalc",
    "ask": "Count how many distinct products have never had a single completed transaction.",
    "hint": "Same indicator=True trick as before, from the other side of the relationship.",
    "solution": "result = products.merge(transactions.query(\"status=='completed'\"), on='product_id', how='left', indicator=True) \\\n  .query(\"_merge=='left_only'\")['product_id'].nunique()",
    "ordered": false,
    "bonus": false,
    "topic": "Python: Merging & joining DataFrames",
    "subtopic": "Anti-joins with indicator=True",
    "id": 33
  },
  {
    "id": 34,
    "topic": "Python: Merging & joining DataFrames",
    "subtopic": null,
    "diff": "recall",
    "type": "written",
    "recall": true,
    "ask": "What does merge(..., indicator=True) give you that a plain merge doesn't, and how do you use it to answer a 'customers with zero transactions' question?",
    "hint": "Talk through it like you're explaining to a peer who knows SQL/pandas basics but hasn't seen this specific pattern - name the technique, when you'd reach for it, and one gotcha.",
    "bonus": false,
    "modelAnswer": "indicator=True adds a _merge column labeling each output row 'left_only', 'right_only', or 'both', which tells you exactly which side of the join failed to match. For an anti-join style question ('customers who never transacted'), you left-merge customers onto transactions and filter to _merge=='left_only' - those are customer rows that found no matching transaction at all, which is exactly what a dedicated anti-join operator would give you if pandas had one."
  },
  {
    "diff": "easy",
    "type": "pycalc",
    "ask": "How many fully duplicated rows exist in transactions (identical across every column)?",
    "hint": "transactions.duplicated() returns a boolean Series flagging repeats after the first occurrence; .sum() counts the Trues.",
    "solution": "result = transactions.duplicated().sum()",
    "ordered": false,
    "bonus": false,
    "id": 35,
    "topic": "Python: Handling missing & duplicate data",
    "subtopic": "Finding duplicate rows"
  },
  {
    "diff": "easy",
    "type": "pycalc",
    "ask": "How many fully duplicated rows exist in the campaign table?",
    "hint": "Same check as before, different table.",
    "solution": "result = campaign.duplicated().sum()",
    "ordered": false,
    "bonus": false,
    "topic": "Python: Handling missing & duplicate data",
    "subtopic": "Finding duplicate rows",
    "id": 36
  },
  {
    "diff": "medium",
    "type": "pycalc",
    "ask": "How many rows would transactions have after removing exact duplicate rows?",
    "hint": "transactions.drop_duplicates().shape[0]",
    "solution": "result = transactions.drop_duplicates().shape[0]",
    "ordered": false,
    "bonus": false,
    "id": 37,
    "topic": "Python: Handling missing & duplicate data",
    "subtopic": "Removing duplicates safely"
  },
  {
    "diff": "medium",
    "type": "pycalc",
    "ask": "How many distinct customers have at least one row in transactions?",
    "hint": "subset= isn't required here - think about what a single-row-per-customer_id result actually represents.",
    "solution": "result = transactions.drop_duplicates(subset='customer_id').shape[0]",
    "ordered": false,
    "bonus": false,
    "topic": "Python: Handling missing & duplicate data",
    "subtopic": "Removing duplicates safely",
    "id": 38
  },
  {
    "diff": "hard",
    "type": "pycalc",
    "ask": "Compute each customer's total completed-transaction amount, including customers with zero completed transactions (they should show 0, not be missing).",
    "hint": "Start from the full customer_id list, left-merge the groupby aggregate onto it, then fillna(0) - a plain groupby would silently drop the zero-transaction customers.",
    "solution": "result = customers[['customer_id']].merge(\n  transactions.query(\"status=='completed'\").groupby('customer_id', as_index=False)['amount'].sum(),\n  on='customer_id', how='left'\n).fillna({'amount': 0})",
    "ordered": false,
    "bonus": false,
    "id": 39,
    "topic": "Python: Handling missing & duplicate data",
    "subtopic": "Preserving zero-count groups with left-merge + fillna"
  },
  {
    "diff": "hard",
    "type": "pycalc",
    "ask": "Compute each customer's total number of events (of any type), including customers with zero events (they should show 0, not be missing).",
    "hint": "Same left-merge-then-fillna shape as before, different key table.",
    "solution": "result = customers[['customer_id']].merge(\n  events.groupby('customer_id', as_index=False).size(),\n  on='customer_id', how='left'\n).fillna({'size': 0})",
    "ordered": false,
    "bonus": false,
    "topic": "Python: Handling missing & duplicate data",
    "subtopic": "Preserving zero-count groups with left-merge + fillna",
    "id": 40
  },
  {
    "id": 41,
    "topic": "Python: Handling missing & duplicate data",
    "subtopic": null,
    "diff": "recall",
    "type": "written",
    "recall": true,
    "ask": "Why does a plain groupby silently produce a wrong answer for 'average completed amount per customer' if some customers have zero completed transactions, and what's the fix?",
    "hint": "Talk through it like you're explaining to a peer who knows SQL/pandas basics but hasn't seen this specific pattern - name the technique, when you'd reach for it, and one gotcha.",
    "bonus": false,
    "modelAnswer": "groupby only ever produces a row for groups that actually appear in the data, so a customer with zero completed transactions simply never shows up in the groupby output - they aren't included as a 0, they're just missing. If you then average or sum across that output, you've silently averaged only over customers who transacted, inflating the per-customer figure. The fix is to start from the full key list (e.g. all customer_ids) and left-merge the aggregate onto it, then fillna(0) for the customers that never matched."
  },
  {
    "diff": "easy",
    "type": "pycalc",
    "ask": "Add a high_value column: 'high_value' if amount > 200, else 'standard'.",
    "hint": "np.where(condition, value_if_true, value_if_false) is a vectorized if/else.",
    "solution": "result = transactions.assign(high_value=np.where(transactions['amount'] > 200, 'high_value', 'standard'))",
    "ordered": false,
    "bonus": false,
    "id": 42,
    "topic": "Python: Apply, map & vectorized operations",
    "subtopic": "np.where for binary flags"
  },
  {
    "diff": "easy",
    "type": "pycalc",
    "ask": "Merge in each transaction's customer signup_date, then add a recent_signup column: True if signup_date >= '2024-04-01', else False.",
    "hint": "np.where's condition doesn't have to be numeric.",
    "solution": "result = transactions.merge(customers[['customer_id','signup_date']], on='customer_id', how='left').assign(\n  recent_signup=lambda d: np.where(d['signup_date'] >= '2024-04-01', True, False)\n)",
    "ordered": false,
    "bonus": false,
    "topic": "Python: Apply, map & vectorized operations",
    "subtopic": "np.where for binary flags",
    "id": 43
  },
  {
    "diff": "medium",
    "type": "pycalc",
    "ask": "Add an amount_bucket column: 'small' if amount < 50, 'medium' if amount < 200, else 'large'.",
    "hint": "np.select(conditions_list, choices_list, default=...) handles more than two branches; conditions are checked in order.",
    "solution": "result = transactions.assign(amount_bucket=np.select(\n  [transactions['amount'] < 50, transactions['amount'] < 200],\n  ['small', 'medium'],\n  default='large'\n))",
    "ordered": false,
    "bonus": false,
    "id": 44,
    "topic": "Python: Apply, map & vectorized operations",
    "subtopic": "np.select for multi-way buckets"
  },
  {
    "diff": "medium",
    "type": "pycalc",
    "ask": "Add a discount_multiplier column to customers: 0.9 for Enterprise, 0.95 for SMB, 1.0 for everyone else.",
    "hint": "np.select can output numbers instead of strings.",
    "solution": "result = customers.assign(discount_multiplier=np.select(\n  [customers['segment']=='Enterprise', customers['segment']=='SMB'],\n  [0.9, 0.95], default=1.0\n))",
    "ordered": false,
    "bonus": false,
    "topic": "Python: Apply, map & vectorized operations",
    "subtopic": "np.select for multi-way buckets",
    "id": 45
  },
  {
    "diff": "hard",
    "type": "pycalc",
    "ask": "Merge in each transaction's customer segment, then compute adj_amount: amount * 0.9 for Enterprise-segment customers, else amount unchanged.",
    "hint": "Merge first to get the segment column, then np.where(segment=='Enterprise', amount*0.9, amount) - vectorized, not .apply(axis=1).",
    "solution": "result = transactions.merge(customers[['customer_id','segment']], on='customer_id', how='left').assign(\n  adj_amount=lambda d: np.where(d['segment'] == 'Enterprise', d['amount'] * 0.9, d['amount'])\n)",
    "ordered": false,
    "bonus": false,
    "id": 46,
    "topic": "Python: Apply, map & vectorized operations",
    "subtopic": "Vectorizing a conditional adjustment (vs .apply)"
  },
  {
    "diff": "hard",
    "type": "pycalc",
    "ask": "Merge in each transaction's customer acquisition_channel, then compute adj_amount: amount * 1.1 for customers acquired via the 'Paid' channel, else amount unchanged.",
    "hint": "Same vectorized-adjustment shape as before, different condition and multiplier.",
    "solution": "result = transactions.merge(customers[['customer_id','acquisition_channel']], on='customer_id', how='left').assign(\n  adj_amount=lambda d: np.where(d['acquisition_channel'] == 'Paid', d['amount'] * 1.1, d['amount'])\n)",
    "ordered": false,
    "bonus": false,
    "topic": "Python: Apply, map & vectorized operations",
    "subtopic": "Vectorizing a conditional adjustment (vs .apply)",
    "id": 47
  },
  {
    "id": 48,
    "topic": "Python: Apply, map & vectorized operations",
    "subtopic": null,
    "diff": "recall",
    "type": "written",
    "recall": true,
    "ask": "When would you reach for .apply(axis=1) instead of np.where/np.select, given that the vectorized versions are faster?",
    "hint": "Talk through it like you're explaining to a peer who knows SQL/pandas basics but hasn't seen this specific pattern - name the technique, when you'd reach for it, and one gotcha.",
    "bonus": false,
    "modelAnswer": "np.where/np.select cover simple conditional logic on one or a few columns and run at native (C/numpy) speed across the whole column at once. .apply(axis=1) is slower because it re-invokes a Python function once per row, but it's more flexible - reach for it when the logic genuinely needs arbitrary per-row Python (calling an external function, complex branching that doesn't reduce to a clean boolean mask, or row-wise logic that's awkward to vectorize) rather than when it's just laziness about writing the vectorized version."
  },
  {
    "diff": "easy",
    "type": "pycalc",
    "ask": "For completed transactions, rank each customer's own transactions by amount descending (ties get the same rank, gaps allowed) in a new rnk column.",
    "hint": "groupby('customer_id')['amount'].rank(method='min', ascending=False) - method='min' matches SQL RANK()'s gap-after-ties behavior.",
    "solution": "result = transactions.query(\"status=='completed'\").assign(\n  rnk=lambda d: d.groupby('customer_id')['amount'].rank(method='min', ascending=False)\n)",
    "ordered": false,
    "bonus": false,
    "id": 49,
    "topic": "Python: Ranking & deduplication (latest record per group)",
    "subtopic": "rank() within a group"
  },
  {
    "diff": "easy",
    "type": "pycalc",
    "ask": "For completed transactions, rank each product's own transactions by amount descending in a new rnk column.",
    "hint": "Same rank() shape as before - just change the groupby key.",
    "solution": "result = transactions.query(\"status=='completed'\").assign(\n  rnk=lambda d: d.groupby('product_id')['amount'].rank(method='min', ascending=False)\n)",
    "ordered": false,
    "bonus": false,
    "topic": "Python: Ranking & deduplication (latest record per group)",
    "subtopic": "rank() within a group",
    "id": 50
  },
  {
    "diff": "medium",
    "type": "pycalc",
    "ask": "Return each customer's single most recent completed transaction, using sort + groupby.tail.",
    "hint": "Sort by txn_date ascending, then groupby('customer_id').tail(1) grabs the last (most recent) row per group.",
    "solution": "result = transactions.query(\"status=='completed'\").sort_values('txn_date').groupby('customer_id').tail(1)",
    "ordered": false,
    "bonus": false,
    "id": 51,
    "topic": "Python: Ranking & deduplication (latest record per group)",
    "subtopic": "Latest-per-group via sort + groupby.tail"
  },
  {
    "diff": "medium",
    "type": "pycalc",
    "ask": "Return each customer's earliest completed transaction, using sort + groupby.head instead of tail.",
    "hint": "Think about which end of a sorted group .head() grabs versus .tail().",
    "solution": "result = transactions.query(\"status=='completed'\").sort_values('txn_date').groupby('customer_id').head(1)",
    "ordered": false,
    "bonus": false,
    "topic": "Python: Ranking & deduplication (latest record per group)",
    "subtopic": "Latest-per-group via sort + groupby.tail",
    "id": 52
  },
  {
    "diff": "hard",
    "type": "pycalc",
    "ask": "Return the same 'most recent completed transaction per customer' result as the previous question, but this time using drop_duplicates instead of groupby.tail.",
    "hint": "Sort by txn_date ascending, then drop_duplicates(subset='customer_id', keep='last').",
    "solution": "result = transactions.query(\"status=='completed'\").sort_values('txn_date').drop_duplicates(subset='customer_id', keep='last')",
    "ordered": false,
    "bonus": false,
    "id": 53,
    "topic": "Python: Ranking & deduplication (latest record per group)",
    "subtopic": "Latest-per-group via drop_duplicates(keep='last')"
  },
  {
    "diff": "hard",
    "type": "pycalc",
    "ask": "Return the same 'earliest completed transaction per customer' result, but using drop_duplicates instead of groupby.head.",
    "hint": "Same drop_duplicates shape as before - which keep= argument gives you the opposite end?",
    "solution": "result = transactions.query(\"status=='completed'\").sort_values('txn_date').drop_duplicates(subset='customer_id', keep='first')",
    "ordered": false,
    "bonus": false,
    "topic": "Python: Ranking & deduplication (latest record per group)",
    "subtopic": "Latest-per-group via drop_duplicates(keep='last')",
    "id": 54
  },
  {
    "id": 55,
    "topic": "Python: Ranking & deduplication (latest record per group)",
    "subtopic": null,
    "diff": "recall",
    "type": "written",
    "recall": true,
    "ask": "Give two different pandas ways to get 'the most recent row per group' and explain why they produce the same result.",
    "hint": "Talk through it like you're explaining to a peer who knows SQL/pandas basics but hasn't seen this specific pattern - name the technique, when you'd reach for it, and one gotcha.",
    "bonus": false,
    "modelAnswer": "Sort ascending by the tiebreaker date, then either (1) groupby('key').tail(1), which takes the last row of each group after the frame is already sorted, or (2) drop_duplicates(subset='key', keep='last'), which keeps only the last-occurring row for each duplicate value of 'key'. Both rely on the same precondition - the frame must already be sorted so that 'last occurrence' and 'last chronologically' mean the same thing - which is exactly why the sort_values() step has to come first in both approaches."
  },
  {
    "diff": "easy",
    "type": "sql",
    "ask": "Count completed transactions per product category (join transactions to products).",
    "hint": "Standard join + groupby - this is meant to be a fast warm-up, not a puzzle.",
    "solution": "SELECT p.category, COUNT(*) AS n_txns\nFROM transactions t JOIN products p ON p.product_id = t.product_id\nWHERE t.status='completed'\nGROUP BY p.category ORDER BY p.category;",
    "ordered": true,
    "bonus": false,
    "id": 56,
    "topic": "Final Prep: Timed mixed mock",
    "subtopic": "Mock Q1 (SQL, easy) \u2014 warm-up join + count"
  },
  {
    "diff": "medium",
    "type": "pycalc",
    "ask": "Find the top 3 customers by total completed-transaction amount, with their country and segment attached.",
    "hint": "groupby+sum to get totals, merge in customer country/segment, sort descending, head(3).",
    "solution": "result = (transactions.query(\"status=='completed'\")\n  .groupby('customer_id', as_index=False)['amount'].sum()\n  .merge(customers[['customer_id','country','segment']], on='customer_id', how='left')\n  .sort_values('amount', ascending=False).head(3))",
    "ordered": true,
    "bonus": false,
    "id": 57,
    "topic": "Final Prep: Timed mixed mock",
    "subtopic": "Mock Q2 (pandas, medium) \u2014 merge, aggregate, sort, head"
  },
  {
    "diff": "hard",
    "type": "sql",
    "ask": "For each customer, return their most recent completed transaction plus the number of days since their previous completed transaction (NULL if there was no previous one).",
    "hint": "Combine the two patterns you practiced: ROW_NUMBER() (partition by customer, order by date desc) to find rn=1, and a julianday(txn_date) - julianday(LAG(txn_date)) day-gap column, both computed in one CTE, then filter the outer query to rn=1.",
    "solution": "WITH changes AS (\n  SELECT customer_id, transaction_id, txn_date, amount,\n    julianday(txn_date) - julianday(LAG(txn_date) OVER (PARTITION BY customer_id ORDER BY txn_date)) AS days_since_prev,\n    ROW_NUMBER() OVER (PARTITION BY customer_id ORDER BY txn_date DESC) AS rn\n  FROM transactions WHERE status='completed'\n)\nSELECT customer_id, transaction_id, txn_date, amount, days_since_prev\nFROM changes WHERE rn=1 ORDER BY customer_id;",
    "ordered": false,
    "bonus": false,
    "id": 58,
    "topic": "Final Prep: Timed mixed mock",
    "subtopic": "Mock Q3 (SQL, hard) \u2014 combine two patterns into one query"
  },
  {
    "id": 59,
    "topic": "Final Prep: Timed mixed mock",
    "subtopic": null,
    "diff": "recall",
    "type": "written",
    "recall": true,
    "ask": "Reflect on your 5-hour prep: which SQL/pandas pattern from this session do you feel least confident narrating out loud under time pressure, and what's the one-sentence version of it you'd say in the interview?",
    "hint": "Talk through it like you're explaining to a peer who knows SQL/pandas basics but hasn't seen this specific pattern - name the technique, when you'd reach for it, and one gotcha.",
    "bonus": false,
    "modelAnswer": "There's no single right answer here - the point of this recall question is to force you to identify your own weakest link honestly (common candidates: window-function-can't-filter-inline, LEFT JOIN vs INNER for conversion rates, or vectorized-vs-apply) and rehearse a one-sentence explanation for it, since narrating your reasoning clearly is explicitly what this interview round is graded on."
  }
];

let current=0;
const solved=new Set();
const flagged=new Set();
const savedAnswers={};

function topicIndices(topic){const out=[];QUESTIONS.forEach((q,i)=>{if(q.topic===topic)out.push(i);});return out;}
function topicRequiredIndices(topic){return topicIndices(topic).filter(i=>!QUESTIONS[i].bonus&&!QUESTIONS[i].recall);}
function topicDone(topic){return topicRequiredIndices(topic).filter(i=>solved.has(QUESTIONS[i].id)).length;}
function requiredCount(){return QUESTIONS.filter(q=>!q.bonus&&!q.recall).length;}
function requiredSolvedCount(){let n=0;QUESTIONS.forEach(q=>{if(!q.bonus&&!q.recall&&solved.has(q.id))n++;});return n;}

function findSubtopic(topic, subtopicName){
  const l=LESSONS[topic];
  if(!l) return null;
  return l.subtopics.find(s=>s.name===subtopicName)||null;
}

function renderLesson(topic, subtopicName){
  const s=findSubtopic(topic, subtopicName);
  if(!s) return "";
  let html=renderMarkdown(s.md);
  if(s.video) html+='<div class="video-embed"><iframe src="https://www.youtube.com/embed/'+s.video.id+'" title="'+mdEscape(s.video.title)+'" allowfullscreen loading="lazy"></iframe></div>';
  if(s.note) html+='<div class="note">'+renderMarkdown(s.note)+'</div>';
  return html;
}

function buildSidebar(){
  let html="";
  TOPICS.forEach((topic,ti)=>{
    const idxs=topicIndices(topic);
    const reqLen=topicRequiredIndices(topic).length;
    if(!idxs.length) return;
    html+='<div class="topic" data-topic="'+ti+'">';
    html+='<div class="topic-head"><span class="tname">'+(ti+1)+'. '+topic+'</span><span class="frac" id="frac-'+ti+'">'+topicDone(topic)+'/'+reqLen+'</span><span class="topic-chev">hide</span></div>';
    html+='<div class="tbar"><i id="tbar-'+ti+'" style="width:'+(reqLen?topicDone(topic)/reqLen*100:0)+'%"></i></div><div class="pad">';
    idxs.forEach(i=>{
      const q=QUESTIONS[i];
      const label=q.recall?"Recall: summarize this topic":(q.ask.slice(0,40)+(q.ask.length>40?"...":""));
      html+='<button class="qbtn'+(solved.has(q.id)?" done":"")+(q.bonus?" bonus":"")+(q.recall?" recall":"")+'" data-i="'+i+'"><span class="dot">'+(solved.has(q.id)?"✓":"")+'</span><span class="star">'+(flagged.has(q.id)?"★":"")+'</span><span class="tagpill tagpill-'+(q.type||"mixed")+'">'+(q.recall?"":(q.type==="sql"?"SQL":"PY"))+'</span><span class="lbl">'+label+'</span></button>';
    });
    html+='</div></div>';
  });
  return html;
}

function buildMain(){
  return '<main>'
    +'<div class="qhead" id="qhead"></div>'
    +'<div class="readystrip"><div class="rt" id="rtTitle"></div><span class="rbar"><i id="rbar"></i></span><span class="rlabel" id="rlabel"></span></div>'
    +'<div class="lesson" id="lesson"><div class="lesson-head" id="lessonHead"><span class="lh" id="lessonTitle">Lesson</span><span class="chev" id="chev">hide</span></div><div class="lesson-body" id="lessonBody"></div></div>'
    +'<div class="ask" id="ask"><span class="albl">The question</span><span class="atext" id="askText"></span></div>'
    +'<div class="promptbox collapsed" id="promptBox"><div class="prompt-head" id="promptHead"><span class="plbl">Hint</span><span class="chev" id="promptChev">show</span></div><p class="hint" id="hint"></p></div>'
    +'<div class="editor-wrap">'
      +'<div class="editor-bar" id="pycalcBar"><span id="editorLabel">query.sql</span><button class="schema-toggle" id="schemaBtn">view schema</button></div>'
      +'<textarea id="sql" spellcheck="false" autocapitalize="off" autocomplete="off"></textarea>'
      +'<textarea id="writtenAnswer" style="display:none" spellcheck="true" placeholder="Type your answer here - a few sentences covering the key ideas is plenty. Talk through it the way you would out loud in the interview."></textarea>'
    +'</div>'
    +'<div class="actions">'
      +'<button class="act run" id="runBtn">Run and check</button>'
      +'<button class="act run" id="checkAnswerBtn" style="display:none">Check answer</button>'
      +'<button class="act" id="solBtn">Show solution</button>'
      +'<button class="act" id="explainBtn">Explain solution</button>'
      +'<button class="act" id="explainWrongBtn" style="display:none">Explain my error</button>'
      +'<select id="explainModel" class="explain-model"><option value="sonnet">Sonnet 5</option><option value="haiku">Haiku 4.5</option></select>'
      +'<button class="act" id="resetBtn">Clear</button>'
      +'<button class="act" id="prevBtn">&larr; Previous</button><button class="act" id="nextBtn">Next &rarr;</button>'
      +'<span class="kbd">Cmd / Ctrl + Enter &middot; Shift + &larr;/&rarr;</span>'
    +'</div>'
    +'<div class="verdict" id="verdict"><span class="ic" id="vic"></span><span id="vmsg"></span></div>'
    +'<div class="stdoutbox" id="stdoutBox" style="display:none"><div class="lbl">Console output</div><pre id="stdoutText"></pre></div>'
    +'<div class="stdoutbox" id="varsBox" style="display:none"><div class="lbl">Your variables</div><div id="varsText"></div></div>'
    +'<div class="results" id="resultsBox" style="display:none"><h3>Your result</h3><div class="tablescroll" id="tableScroll"></div><div class="rowcount" id="rowCount"></div></div>'
    +'<div class="solution" id="solution"><div class="lbl" id="solutionLbl">One correct solution (there are often several)</div><pre id="solText"></pre><div id="solProse" style="display:none"></div></div>'
    +'<div class="explainbox" id="explainBox" style="display:none"><div class="lbl" id="explainLbl">Claude explains</div><div id="explainText"></div></div>'
    +'<div class="schema" id="schema"></div></main>';
}

function updateTopic(topic){
  const ti=TOPICS.indexOf(topic);const reqLen=topicRequiredIndices(topic).length;const done=topicDone(topic);
  const frac=document.getElementById("frac-"+ti);
  if(!frac) return;
  frac.textContent=done+"/"+reqLen;frac.className="frac"+(done===reqLen?" full":"");
  document.getElementById("tbar-"+ti).style.width=(reqLen?done/reqLen*100:0)+"%";
  if(document.getElementById("rtTitle") && QUESTIONS[current].topic===topic){
    setReadystrip(topic,done,reqLen);
  }
}
function setReadystrip(topic,done,total){
  document.getElementById("rtTitle").innerHTML=topic+"<small>Topic "+(TOPICS.indexOf(topic)+1)+" of "+TOPICS.length+"</small>";
  document.getElementById("rbar").style.width=(total?done/total*100:0)+"%";
  const lab=document.getElementById("rlabel");
  if(done===0){lab.textContent="Not started";lab.className="rlabel";}
  else if(done<total){lab.textContent="In progress "+done+"/"+total;lab.className="rlabel prep";}
  else{lab.textContent="Ready ✓";lab.className="rlabel ready";}
}
function updateProgress(){
  const done=requiredSolvedCount(),total=requiredCount();
  document.getElementById("doneCount").textContent=done;
  document.getElementById("progBar").style.width=(total?Math.round(done/total*100):0)+"%";
  updateQuizGate(done,total);
}
function updateQuizGate(done,total){
  const btn=document.getElementById("quizBtn");
  if(!btn) return;
  if(done>=total){btn.classList.remove("locked");btn.removeAttribute("aria-disabled");}
  else{btn.classList.add("locked");btn.setAttribute("aria-disabled","true");}
}

function setAnswerAreaForType(type){
  document.getElementById("pycalcBar").style.display=type==="written"?"none":"flex";
  document.getElementById("sql").style.display=type==="written"?"none":"block";
  document.getElementById("writtenAnswer").style.display=type==="written"?"block":"none";
  document.getElementById("runBtn").style.display=type==="written"?"none":"";
  document.getElementById("checkAnswerBtn").style.display=type==="written"?"":"none";
  document.getElementById("schemaBtn").style.display=type==="written"?"none":"";
}

function loadQuestion(i){
  current=i;const q=QUESTIONS[i];
  document.getElementById("qtick").textContent="Q"+(i+1);
  document.getElementById("qhead").innerHTML='<button class="star-toggle" id="starToggle" type="button" aria-label="Mark to come back to">☆</button><span class="pill '+q.diff+'">'+q.diff+'</span><span class="pill">'+q.topic+'</span><span class="pill est" id="estBadge">'+estimateLabel(q.diff)+'</span><span class="qtimer" id="qtimerMain">00:00</span><span class="cleared '+(solved.has(q.id)?"show":"")+'" id="clearedStamp">cleared</span>';
  renderStar(q.id);
  document.getElementById("starToggle").addEventListener("click",()=>toggleFlag(q.id));
  startQuestionTimer(q.diff);
  const lessonCard=document.getElementById("lesson");
  if(q.recall){
    lessonCard.style.display="none";
  }else{
    lessonCard.style.display="";
    document.getElementById("lessonTitle").textContent=q.subtopic||"Lesson";
    document.getElementById("lessonBody").innerHTML=renderLesson(q.topic, q.subtopic);
  }
  document.getElementById("askText").textContent=q.ask;
  document.getElementById("promptBox").classList.add("collapsed");
  document.getElementById("promptChev").textContent="show";
  document.getElementById("hint").innerHTML="<b>Hint:</b> "+q.hint;
  const effectiveType=q.recall?"written":q.type;
  setAnswerAreaForType(effectiveType);
  document.getElementById("editorLabel").textContent=q.type==="sql"?"query.sql":"answer.py";
  document.getElementById("verdict").className="verdict";
  document.getElementById("stdoutBox").style.display="none";
  document.getElementById("varsBox").style.display="none";
  document.getElementById("resultsBox").style.display="none";
  document.getElementById("solution").className="solution";
  document.getElementById("explainBox").style.display="none";
  setExplainWrongVisible(false);
  const solLbl=document.getElementById("solutionLbl"),solText=document.getElementById("solText"),solProse=document.getElementById("solProse");
  if(q.recall){
    solLbl.textContent="What a strong summary should cover";
    solText.style.display="none";
    solProse.style.display="block";solProse.innerHTML=renderMarkdown(q.modelAnswer);
    document.getElementById("writtenAnswer").value=savedAnswers[q.id]||"";
  }else{
    solLbl.textContent="One correct solution (there are often several)";
    solText.style.display="block";
    solText.textContent=q.type==="sql"?formatSQL(q.solution):q.solution;
    solProse.style.display="none";
    document.getElementById("sql").value=savedAnswers[q.id]||"";
  }
  const reqLen=topicRequiredIndices(q.topic).length;setReadystrip(q.topic,topicDone(q.topic),reqLen);
  document.querySelectorAll(".qbtn").forEach(b=>b.classList.toggle("active",+b.dataset.i===i));
  document.getElementById("prevBtn").disabled=(i===0);
  document.getElementById("nextBtn").disabled=(i===QUESTIONS.length-1);
  document.querySelector("main").scrollIntoView({behavior:"smooth",block:"start"});
  if(q.recall) document.getElementById("writtenAnswer").focus({preventScroll:true});
  else document.getElementById("sql").focus({preventScroll:true});
}
function goToQuestion(delta){
  const next=current+delta;
  if(next>=0 && next<QUESTIONS.length) loadQuestion(next);
}
function markSolved(i){
  const id=QUESTIONS[i].id;
  if(!solved.has(id)){
    solved.add(id);
    const btn=document.querySelector('.qbtn[data-i="'+i+'"]');
    if(btn){btn.classList.add("done");btn.querySelector(".dot").textContent="✓";}
    const st=document.getElementById("clearedStamp");if(st)st.classList.add("show");
    updateProgress();updateTopic(QUESTIONS[i].topic);
  }
}

async function doCheckWritten(){
  const q=QUESTIONS[current];
  const answer=document.getElementById("writtenAnswer").value.trim();
  if(!answer) return;
  savedAnswers[q.id]=answer;
  const btn=document.getElementById("checkAnswerBtn");
  const orig=btn.textContent;
  btn.disabled=true;btn.textContent="Checking...";
  const box=document.getElementById("explainBox"),txt=document.getElementById("explainText"),lbl=document.getElementById("explainLbl");
  lbl.textContent="Feedback on your answer";
  box.style.display="block";
  txt.innerHTML='<div class="explain-loading"><span class="spinner"></span>Reading through your answer…</div>';
  const verdict=document.getElementById("verdict"),vic=document.getElementById("vic"),vmsg=document.getElementById("vmsg");
  try{
    const payload={track:"finalprep",mode:"trainer",questionId:q.id,kind:"grade",ask:q.ask,solution:q.modelAnswer,studentAnswer:answer,model:getExplainModel()};
    const r=await requestExplanation(payload);
    txt.innerHTML=renderMarkdown(r.content);
    box.scrollIntoView({behavior:"smooth",block:"nearest"});
    const strong=/\*\*strong\*\*/i.test(r.content) || /^strong/i.test(r.content.replace(/[*_]/g,""));
    verdict.className="verdict "+(strong?"ok":"no");
    vic.textContent=strong?"✓":"~";
    vmsg.textContent=strong?"Graded as strong - see feedback below.":"See feedback below for what to add.";
    logAttempt(q.id,answer,strong);
    if(strong) markSolved(current);
  }catch(e){
    txt.textContent=e.message;
  }finally{
    btn.disabled=false;btn.textContent=orig;
    lbl.textContent="Claude explains";
  }
}

async function doRunSql(){
  const q=QUESTIONS[current];const sql=document.getElementById("sql").value.trim();
  const verdict=document.getElementById("verdict"),vic=document.getElementById("vic"),vmsg=document.getElementById("vmsg"),resultsBox=document.getElementById("resultsBox");
  if(!sql)return;
  let userRes;
  try{userRes=runSQL(sql);}catch(err){verdict.className="verdict no";vic.textContent="!";vmsg.textContent="SQL error: "+err.message;resultsBox.style.display="none";setExplainWrongVisible(true);return;}
  resultsBox.style.display="block";
  document.getElementById("tableScroll").innerHTML=renderSqlTable(userRes);
  const n=userRes.values.length;
  document.getElementById("rowCount").textContent=n+" row"+(n===1?"":"s")+" returned"+(n>200?" (showing first 200)":"");
  let solRes;try{solRes=runSQL(q.solution);}catch(e){solRes={columns:[],values:[]};}
  const g=grade(userRes,solRes,q.ordered);
  if(g.ok){verdict.className="verdict ok";vic.textContent="✓";vmsg.textContent=g.msg;markSolved(current);savedAnswers[q.id]=sql;}
  else{verdict.className="verdict no";vic.textContent="✗";vmsg.textContent=g.msg;}
  logAttempt(q.id,sql,g.ok);
  setExplainWrongVisible(!g.ok);
}
function renderSqlTable(res){
  if(!res.columns.length) return '<div style="padding:14px;color:var(--muted);font-family:var(--mono);font-size:12.5px">No columns returned.</div>';
  let h='<table><thead><tr>';res.columns.forEach(c=>h+='<th>'+c+'</th>');h+='</tr></thead><tbody>';
  res.values.slice(0,200).forEach(row=>{h+='<tr>';row.forEach(v=>{h+=(v===null||v===undefined)?'<td class="null">NULL</td>':'<td>'+String(v)+'</td>';});h+='</tr>';});
  return h+'</tbody></table>';
}

async function doRunPycalc(){
  const q=QUESTIONS[current];const code=document.getElementById("sql").value;
  const verdict=document.getElementById("verdict"),vic=document.getElementById("vic"),vmsg=document.getElementById("vmsg"),resultsBox=document.getElementById("resultsBox");
  if(!code.trim())return;
  const runBtn=document.getElementById("runBtn");
  runBtn.disabled=true;runBtn.textContent="Running...";
  let g;
  try{
    g=await runAndGrade(code, q.solution, q.ordered);
  }finally{
    runBtn.disabled=false;runBtn.textContent="Run and check";
  }
  const stdoutBox=document.getElementById("stdoutBox");
  if(g.stdout && g.stdout.trim()){
    stdoutBox.style.display="block";
    document.getElementById("stdoutText").textContent=g.stdout;
  }else{
    stdoutBox.style.display="none";
  }
  const varsBox=document.getElementById("varsBox");
  varsBox.style.display="none";
  if(g.error){
    verdict.className="verdict no";vic.textContent="!";vmsg.textContent="Python error: "+g.error;
    resultsBox.style.display="none";
    setExplainWrongVisible(true);
    return;
  }
  if(g.no_result){
    verdict.className="verdict no";vic.textContent="?";vmsg.textContent=g.msg;
    resultsBox.style.display="none";
    setExplainWrongVisible(true);
    if(g.vars && g.vars.length){
      varsBox.style.display="block";
      document.getElementById("varsText").innerHTML=g.vars.map(v=>
        '<div style="margin-bottom:6px"><b>'+v.name+'</b> <span style="color:var(--muted)">('+v.type+')</span><br>'+v.preview+'</div>'
      ).join("");
    }
    return;
  }
  resultsBox.style.display="block";
  document.getElementById("tableScroll").innerHTML=renderPyTable(g);
  const n=g.rowcount;
  document.getElementById("rowCount").textContent=n+" row"+(n===1?"":"s")+" returned"+(n>200?" (showing first 200)":"")+(g.source==="last_expression"?" (read from the last line of your code)":"");
  if(g.ok){verdict.className="verdict ok";vic.textContent="✓";vmsg.textContent=g.msg;markSolved(current);savedAnswers[q.id]=code;}
  else{verdict.className="verdict no";vic.textContent="✗";vmsg.textContent=g.msg;}
  logAttempt(q.id,code,g.ok);
  setExplainWrongVisible(!g.ok);
}

function doRun(){
  const q=QUESTIONS[current];
  if(q.recall) return doCheckWritten();
  if(q.type==="sql") return doRunSql();
  return doRunPycalc();
}

let supabaseClient=null, currentUser=null, startIndex=0;

function initSupabase(){
  supabaseClient=window.supabase.createClient(window.__SUPABASE_URL__, window.__SUPABASE_ANON_KEY__);
}

function showSignOutBtn(){
  const btn=document.getElementById("signOutBtn");
  btn.classList.add("visible");
  btn.addEventListener("click",()=>{
    supabaseClient.auth.signOut().then(()=>window.location.reload());
  });
}

function requireAuth(){
  return supabaseClient.auth.getSession().then(({data:{session}})=>{
    if(session){currentUser=session.user;showSignOutBtn();return;}
    const gate=document.getElementById("authGate");
    gate.style.display="flex";
    return new Promise(resolve=>{
      document.getElementById("googleSignInBtn").addEventListener("click",()=>{
        supabaseClient.auth.signInWithOAuth({provider:"google",options:{redirectTo:window.location.origin}});
      });
      supabaseClient.auth.onAuthStateChange((event,session)=>{
        if(session && !currentUser){
          currentUser=session.user;
          gate.style.display="none";
          showSignOutBtn();
          resolve();
        }
      });
    });
  });
}

function hydrateProgress(){
  return supabaseClient.from("attempts").select("question_id,passed,query_text,created_at").eq("mode","trainer").eq("track","finalprep").order("created_at",{ascending:true})
    .then(({data,error})=>{
      if(error||!data) return;
      data.forEach(r=>{
        const q=QUESTIONS.find(x=>x.id===r.question_id);
        if(r.passed)solved.add(r.question_id);
        if(r.passed||(q&&q.recall))savedAnswers[r.question_id]=r.query_text;
      });
      if(data.length) startIndex=data[data.length-1].question_id;
    });
}

function hydrateFlags(){
  return fetchFlaggedIds("finalprep","trainer").then(ids=>ids.forEach(id=>flagged.add(id)));
}

function toggleFlag(id){
  const on=!flagged.has(id);
  if(on) flagged.add(id); else flagged.delete(id);
  setQuestionFlag("finalprep","trainer",id,on);
  renderStar(id);
  const btn=document.querySelector('.qbtn[data-i="'+current+'"]');
  if(btn){
    const st=btn.querySelector(".star");
    if(st) st.textContent=on?"★":"";
  }
  applySidebarFilters();
}

function renderStar(id){
  const btn=document.getElementById("starToggle");
  if(!btn) return;
  const on=flagged.has(id);
  btn.textContent=on?"★":"☆";
  btn.classList.toggle("on",on);
  btn.setAttribute("aria-label",on?"Marked to come back to":"Mark to come back to");
}

async function runExplain(kind){
  const q=QUESTIONS[current];
  const btn=document.getElementById(kind==="solution"?"explainBtn":"explainWrongBtn");
  const box=document.getElementById("explainBox"),lbl=document.getElementById("explainLbl");
  const txt=document.getElementById("explainText");
  const orig=btn.textContent;
  btn.disabled=true;btn.textContent="Thinking...";
  lbl.textContent="Claude explains";
  box.style.display="block";
  txt.innerHTML='<div class="explain-loading"><span class="spinner"></span>Thinking through the solution…</div>';
  try{
    const refSolution=q.recall?q.modelAnswer:q.solution;
    const payload={track:"finalprep",mode:"trainer",questionId:q.id,kind,ask:q.ask,prompt:"",solution:refSolution,model:getExplainModel()};
    if(!q.recall) payload.engine=q.type;
    if(kind==="attempt"){
      payload.userCode=q.recall?(savedAnswers[q.id]||""):document.getElementById("sql").value;
    }
    const r=await requestExplanation(payload);
    txt.innerHTML=renderMarkdown(r.content);
    box.scrollIntoView({behavior:"smooth",block:"nearest"});
  }catch(e){
    txt.textContent=e.message;
  }finally{
    btn.disabled=false;btn.textContent=orig;
  }
}

function logAttempt(questionId,answerText,passed){
  if(!supabaseClient||!currentUser) return;
  supabaseClient.from("attempts").insert({question_id:questionId,query_text:answerText,passed,mode:"trainer",track:"finalprep"}).then(()=>{});
}

initSupabase();
initThemeToggle();
initTrainerSelect();

window.addEventListener("scroll",()=>{
  document.body.classList.toggle("scrolled",window.scrollY>30);
  syncHeaderHeight();
  setTimeout(syncHeaderHeight,200);
},{passive:true});

if(window.visualViewport){
  window.visualViewport.addEventListener("resize",()=>{
    document.body.classList.toggle("scrolled",window.scrollY>30);
    syncHeaderHeight();
  });
}

window.addEventListener("resize",syncHeaderHeight);
syncHeaderHeight();
setTimeout(syncHeaderHeight,300);

let db=null;

Promise.all([
  initSqlJs({locateFile:f=>"https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.8.0/"+f}),
  initPyodideEnv(),
  requireAuth().then(()=>Promise.all([hydrateProgress(),hydrateFlags()]))
])
.then(([SQL])=>{
  db=new SQL.Database();db.run(SCHEMA_SQL);
  const app=document.getElementById("app");app.className="";
  app.innerHTML='<div class="wrap"><aside id="sidebar">'+buildSidebarFilterBar()+buildSidebar()+'</aside>'+buildMain()+'<div class="col-resizer" id="colResizer"></div><div class="right-col" id="rightCol"></div></div>';
  document.getElementById("schema").innerHTML=buildSchema();
  document.getElementById("totalCount").textContent=requiredCount();
  document.querySelectorAll(".qbtn").forEach(b=>b.addEventListener("click",()=>loadQuestion(+b.dataset.i)));
  document.getElementById("runBtn").addEventListener("click",doRun);
  document.getElementById("checkAnswerBtn").addEventListener("click",doRun);
  document.getElementById("explainBtn").addEventListener("click",()=>runExplain("solution"));
  document.getElementById("explainWrongBtn").addEventListener("click",()=>runExplain("attempt"));
  initExplainModelSelect();
  initShellLayout();
  initTopicCollapse("collapsedTopicsFinalPrep");
  initSidebarFilters();
  document.getElementById("solBtn").addEventListener("click",()=>document.getElementById("solution").classList.toggle("show"));
  document.getElementById("resetBtn").addEventListener("click",()=>{
    const q=QUESTIONS[current];
    if(q.recall){document.getElementById("writtenAnswer").value="";document.getElementById("writtenAnswer").focus();}
    else{document.getElementById("sql").value="";document.getElementById("sql").focus();}
  });
  document.getElementById("schemaBtn").addEventListener("click",()=>document.getElementById("schema").scrollIntoView({behavior:"smooth"}));
  document.getElementById("prevBtn").addEventListener("click",()=>goToQuestion(-1));
  document.getElementById("nextBtn").addEventListener("click",()=>goToQuestion(1));
  const lh=document.getElementById("lessonHead");
  lh.addEventListener("click",()=>{const l=document.getElementById("lesson");l.classList.toggle("collapsed");document.getElementById("chev").textContent=l.classList.contains("collapsed")?"show":"hide";});
  const ph=document.getElementById("promptHead");
  ph.addEventListener("click",()=>{const p=document.getElementById("promptBox");p.classList.toggle("collapsed");document.getElementById("promptChev").textContent=p.classList.contains("collapsed")?"show":"hide";});
  const ta=document.getElementById("sql");
  ta.addEventListener("keydown",e=>{
    if((e.metaKey||e.ctrlKey)&&e.key==="Enter"){e.preventDefault();doRun();}
    if(e.key==="Tab"){e.preventDefault();const s=ta.selectionStart,en=ta.selectionEnd;ta.value=ta.value.slice(0,s)+"  "+ta.value.slice(en);ta.selectionStart=ta.selectionEnd=s+2;}
  });
  const wa=document.getElementById("writtenAnswer");
  wa.addEventListener("keydown",e=>{
    if((e.metaKey||e.ctrlKey)&&e.key==="Enter"){e.preventDefault();doRun();}
  });
  document.addEventListener("keydown",e=>{
    if(!e.shiftKey || document.activeElement===ta || document.activeElement===wa) return;
    if(e.key==="ArrowLeft"){e.preventDefault();goToQuestion(-1);}
    if(e.key==="ArrowRight"){e.preventDefault();goToQuestion(1);}
  });
  updateProgress();loadQuestion(startIndex);
})
.catch(err=>{document.getElementById("app").innerHTML='<div class="loading">Could not load the SQL/Python engines. Check your connection and reload. ('+err.message+')</div>';});
