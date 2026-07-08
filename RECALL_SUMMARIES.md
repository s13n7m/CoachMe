# Recall Question Grading References

This document lists the grading reference used for every topic's **Recall** question (the end-of-topic Feynman-technique summary exercise). Each reference describes what a **strong** answer should cover - it's passed to Claude as the `solution` when grading a student's typed recall summary via `/api/explain` (`kind: "grade"`).

## How to edit these

The live, authoritative copy of each reference lives directly in the trainer's JS file, embedded on the matching Recall question object's `modelAnswer` field:

- **SQL Trainer** - `public/trainer.js` (search for `"recall": true` to find each Recall question object)
- **Python Trainer** - `public/python-trainer.js` (search for `"recall": true` to find each Recall question object)
- **ML Fundamentals Trainer** - `public/ml-trainer.js` (search for `"recall": true` to find each Recall question object)

This document is a **generated, read-only mirror** of that same content, meant purely for easy browsing/review in one place. If you edit a reference, edit it directly in the trainer JS file (on the Recall question's `modelAnswer` field), then ask Claude to regenerate this document from the updated source so the two never drift apart.

---

## SQL Trainer

### SELECT and DISTINCT

A strong summary should explain that SELECT chooses which columns to return from a table, and that column order in the output follows the order named in the SELECT clause, not the table's original layout. It should mention SELECT * as a quick way to return every column, useful for exploration but risky to leave in production code since it breaks if the table's schema changes. It should explain that DISTINCT removes duplicate rows from the result, and specifically that when DISTINCT is applied to multiple columns together, it collapses duplicate *combinations* of those columns, not each column independently. A strong answer might also mention aliasing columns with AS to rename output labels without changing the underlying data.

### Filtering with WHERE

A strong summary should explain that WHERE filters individual rows before any grouping happens, based on a boolean condition. It should cover the standard comparison operators, combining conditions with AND/OR (and that AND binds before OR unless parentheses say otherwise), and IN as a shorthand for multiple OR-equality checks against a list. It should mention that NULL requires IS NULL / IS NOT NULL rather than = or != , since NULL is not equal to anything, including itself. BETWEEN and LIKE (with % and _ wildcards) for pattern matching are also worth mentioning.

### Sorting and limiting

A strong summary should explain that ORDER BY sorts the final result set, ascending by default (ASC) or descending with DESC, and that it can sort by multiple columns in sequence (ties in the first column broken by the second, and so on). It should explain LIMIT restricts how many rows are returned, commonly paired with ORDER BY to answer 'top N' questions, and that without an ORDER BY, which rows a LIMIT returns is not guaranteed to be consistent across runs.

### Aggregation and COUNT DISTINCT

A strong summary should cover the core aggregate functions - COUNT, SUM, AVG, MIN, MAX - and that they collapse many rows into a single summary value. It should specifically explain the difference between COUNT(*) (counts all rows, including ones with NULLs in any column) and COUNT(column) (counts only rows where that specific column is not NULL), and that COUNT(DISTINCT column) counts unique non-null values rather than every row. It should note that aggregate functions ignore NULLs in their input column entirely, which affects AVG in particular.

### GROUP BY

A strong summary should explain that GROUP BY splits rows into buckets based on one or more column values, and that any aggregate function in the SELECT list (COUNT, SUM, AVG, etc.) is then computed separately within each bucket rather than across the whole table. It should mention the rule that every non-aggregated column in the SELECT list must appear in the GROUP BY clause (or be functionally dependent on it), and that GROUP BY happens after WHERE filtering but before ORDER BY.

### HAVING

A strong summary should explain that HAVING filters groups after aggregation, in contrast to WHERE, which filters individual rows before any grouping happens. It should give a concrete example of why WHERE can't do a HAVING's job - you can't reference an aggregate like COUNT(*) or SUM(x) in a WHERE clause, because those values don't exist yet at the row-filtering stage. The correct clause order (FROM, WHERE, GROUP BY, HAVING, SELECT, ORDER BY conceptually, even though SELECT is written first) is worth being able to state clearly.

### CASE expressions

A strong summary should explain that CASE WHEN ... THEN ... ELSE ... END lets you compute conditional, row-by-row logic directly inside a SQL query, similar to an if/else chain, producing a new derived value per row. It should mention that conditions are evaluated in order and the first matching WHEN wins, that ELSE provides a default when no condition matches (and that omitting it produces NULL for unmatched rows), and that CASE expressions are commonly used to bucket continuous values into categories or to pivot logic without a separate lookup table.

### Joins

A strong summary should explain that joins combine rows from two or more tables based on a matching condition, usually a shared key. It should distinguish INNER JOIN (only rows with a match in both tables), LEFT JOIN (all rows from the left table, with NULLs filling in for any unmatched right-table columns), and mention RIGHT JOIN and FULL JOIN as the mirrored and combined cases. It should flag the classic pitfall of a join condition that unintentionally matches multiple rows on one side, silently multiplying (fan-out) the result set beyond what was intended, and note that filtering conditions on the right-hand table belong in the ON clause versus WHERE clause differently depending on whether you want to preserve unmatched left-side rows in a LEFT JOIN.

### Subqueries

A strong summary should explain that a subquery is a query nested inside another query, and should distinguish the main patterns: a subquery in the WHERE clause (often with IN, EXISTS, or a scalar comparison) to filter based on another table's results; a scalar subquery used directly as a computed value; and a subquery in the FROM clause acting as a temporary derived table. It should mention EXISTS/NOT EXISTS as often more efficient and more NULL-safe than IN/ NOT IN for checking related-row presence, since NOT IN can behave unexpectedly if the subquery's result contains NULL.

### CTEs

A strong summary should explain that a CTE (WITH ... AS (...)) defines a named, temporary result set that can be referenced later in the same query, making complex queries more readable by breaking them into named, sequential steps rather than nesting nested subqueries. It should mention that multiple CTEs can be chained, each able to reference the ones defined before it, and that a CTE is generally not materialized/cached automatically the way a real table is - it's re-evaluated conceptually each time it's referenced, depending on the database engine.

### Window basics

A strong summary should explain that a window function computes a value across a set of related rows (the 'window') without collapsing them into a single output row the way GROUP BY does - every input row still appears in the output, each now carrying its own window-computed value alongside it. It should cover the OVER() clause, PARTITION BY (which defines the window's grouping, analogous to GROUP BY but without collapsing rows), and ORDER BY inside OVER() (defining the order the window function processes rows in, relevant for running totals and ranking).

### Ranking and deduplication

A strong summary should distinguish ROW_NUMBER() (always assigns a unique, sequential rank with no ties, arbitrary among true ties), RANK() (ties share the same rank, but the next rank skips ahead by the number of tied rows), and DENSE_RANK() (ties share the same rank, but the next rank does not skip). It should explain the common 'latest record per group' or 'top N per group' pattern: using ROW_NUMBER() PARTITION BY the group column, ORDER BY the tiebreak column, then filtering to row number 1 (or N) in an outer query, since window functions can't be filtered directly in the same WHERE clause they're computed in.

### LAG LEAD and period change

A strong summary should explain that LAG() and LEAD() let a query look at a value from a previous or following row, within a defined PARTITION BY/ORDER BY window, without needing a self-join. It should mention the optional offset argument (how many rows back/forward) and default-value argument (what to return when there is no such row, e.g. the first row in a partition has no prior row for LAG). It should connect this to period-over-period comparisons - computing month-over-month or day-over-day change by subtracting a LAG'd prior value from the current row's value.

### NTILE and quantile segmentation

A strong summary should explain that NTILE(n) divides the rows within a window (partition/order) into n roughly equal-sized buckets, numbered 1 through n, commonly used to split customers or values into quartiles, quintiles, or deciles for segmentation. It should mention that when the row count doesn't divide evenly, NTILE distributes the remainder across the earliest buckets, so bucket sizes can differ by at most one row, and that which end (1 or n) represents 'best' or 'highest' depends entirely on the ORDER BY direction chosen inside the window.

### Date and time logic

A strong summary should cover extracting parts of a date/timestamp (year, month, day, day-of-week), computing differences between two dates, and truncating a timestamp down to a coarser grain (e.g. rounding down to the start of the month or week) for grouping purposes. It should mention date arithmetic (adding/subtracting an interval) and the common pattern of bucketing raw timestamps into a coarser period (like month) specifically so they can be used cleanly in a GROUP BY.

### Cohort retention

A strong summary should explain the standard cohort-retention pattern: assigning each customer to a cohort based on their first activity (e.g. signup month), then measuring, for each cohort, what fraction of its original members were still active in each subsequent period. It should mention that this typically requires a self-join or a window function to compare a customer's first-activity date against their activity in later periods, and that the output is usually shaped as a cohort-by-period grid (rows = cohorts, columns = periods since first activity, cells = retention rate).

### Funnel conversion and rate math

A strong summary should explain that a funnel measures how many entities (customers, sessions) progress through a sequence of ordered steps, and that funnel conversion rate at each step is computed relative to a consistent denominator - most commonly the number who reached the very first step, though step-over-step conversion (each step relative to the step immediately before it) is a different, equally valid framing that tells a different story. It should mention the common implementation pattern of a conditional aggregate (SUM(CASE WHEN reached_step THEN 1 ELSE 0 END)) per step, or self-joins/window functions when step order and timing need to be strictly enforced.

### Cross-product attachment

A strong summary should explain that a CROSS JOIN produces every possible combination of rows between two tables (the Cartesian product), with no join condition at all, and that this is genuinely useful - not just an accidental mistake - when you deliberately need every combination, such as pairing every customer with every possible period to make sure periods with zero activity still appear in a report rather than being silently missing. It should mention the risk of an accidental cross join (a join with a missing or malformed ON condition) silently exploding row counts.

### Subtotals with ROLLUP

A strong summary should explain that ROLLUP extends GROUP BY to automatically add subtotal rows at each level of a grouping hierarchy, plus one grand-total row, without needing a manual UNION of separately-aggregated queries. It should mention that ROLLUP's grouping levels are hierarchical and order-sensitive (ROLLUP(a, b) produces subtotals for a-and-b, then a alone, then the grand total - not every possible combination), and that the subtotal rows are typically distinguishable because the columns being 'rolled up over' appear as NULL in those rows.

### Causal setup treatment and control

A strong summary should explain how to identify treatment and control groups directly from a dataset - typically by joining or flagging based on an experiment-assignment table or a treatment-indicator column - and then compute an outcome metric separately for each group so they can be compared. It should mention checking that the comparison is apples-to-apples (similar group sizes/composition, a clearly defined measurement window applied consistently to both groups) and that a raw before/after difference within only the treated group, without any control group comparison, cannot establish causality on its own.

---

## Python Trainer

### DataFrame basics & inspection

A strong summary should explain that a DataFrame is pandas' core 2D labeled data structure - rows and columns, each column with its own dtype - and cover the standard inspection toolkit: .head()/.tail() for a quick peek, .shape for row/column counts, .dtypes for column types, .info() for a combined structural summary including non-null counts, and describe() for quick summary statistics on numeric columns. It should mention that selecting a single column with df['col'] returns a Series, while df[['col']] (double brackets) returns a single-column DataFrame - a subtle but common source of confusion.

### Selecting, filtering, and boolean indexing

A strong summary should explain boolean indexing: building a boolean Series from a condition (e.g. df['spend'] > 100) and using it inside df[...] to keep only matching rows, and that multiple conditions must be combined with & / | (not the plain and/or keywords) with each condition wrapped in parentheses. It should distinguish .loc (label/condition -based selection, inclusive of both endpoints when slicing) from .iloc (purely integer-position-based, exclusive of the end index like standard Python slicing), and mention .isin() as a clean way to filter against a list of values.

### Sorting and top-N selection

A strong summary should cover sort_values() (with the column(s) to sort by, ascending=True/False, and that a list of columns sorts by the first with ties broken by the next), and the shortcut methods nlargest()/nsmallest() for getting the top or bottom N rows by a column without a full sort. It should mention that sort_values() returns a new DataFrame by default (not in-place) unless inplace=True is passed, and that resetting the index with reset_index(drop=True) is often needed after sorting if a clean, sequential index is required downstream.

### GroupBy aggregation

A strong summary should explain that groupby() splits a DataFrame into groups based on one or more column values, applies an aggregate function to each group independently, then combines the results - directly analogous to SQL's GROUP BY. It should cover common aggregates (.sum(), .mean(), .count(), .size()) and specifically the difference between .count() (counts non-null values per column within each group) and .size() (counts rows per group regardless of nulls). It should mention that the grouping column(s) become the index of the result unless as_index=False is passed.

### Multi-column grouping & custom aggregations (.agg)

A strong summary should explain that groupby() accepts a list of columns to group by multiple keys at once, producing a MultiIndex result unless as_index=False is used. It should cover .agg() for applying different aggregate functions to different columns in a single call (e.g. {'spend': 'sum', 'orders': 'mean'}), including passing multiple named aggregations to the same column, and mention that custom aggregation functions (including lambdas) can be passed to .agg() when a built-in aggregate isn't enough.

### Merging and joining DataFrames

A strong summary should explain pd.merge() as pandas' equivalent of a SQL join, covering the how parameter (inner, left, right, outer) and that on/left_on/right_on specify the matching key(s). It should mention that a mismatched or duplicated key on either side can silently multiply the row count in the result (a fan-out, the same risk as a SQL join), and that suffixes handles overlapping column names from both sides. It should also distinguish merge (matches on column values) from .join() (matches on index by default) and pd.concat() (stacks DataFrames together rather than matching on any key).

### Handling missing and duplicate data

A strong summary should cover detecting missing data with isna()/notna(), removing it with dropna() (including the subset and how='all' vs 'any' options), and filling it with fillna() (a constant, a forward/backward fill, or a computed value like the column mean). It should cover duplicated() for detecting duplicate rows and drop_duplicates() for removing them, including the subset parameter for defining duplicates based on only some columns, and the keep parameter for choosing which duplicate to retain.

### String manipulation and regex extraction

A strong summary should explain that pandas' .str accessor applies string operations element-wise across a Series (e.g. .str.lower(), .str.contains(), .str.split()), avoiding the need for a manual Python loop. It should cover .str.extract() for pulling out a regex capture group into a new column, .str.contains() for boolean pattern matching (mentioning the na parameter for handling missing values safely), and .str.replace() for pattern-based substitution, including that a regex flag may need to be set explicitly depending on the pandas version.

### Date and time manipulation

A strong summary should explain pd.to_datetime() for converting a column to proper datetime dtype, and the .dt accessor for extracting date parts (year, month, day, dayofweek) from a datetime Series, directly analogous to the .str accessor for strings. It should cover computing differences between two datetime columns (producing a Timedelta) and resampling or truncating dates to a coarser period (e.g. month-start) using dt.to_period() or floor/round-style operations, for grouping purposes.

### Apply, map, and vectorized operations (np.where/np.select)

A strong summary should explain that vectorized operations (direct arithmetic or comparison on whole columns at once) are almost always faster than .apply() with a row-wise lambda, since vectorized operations run in optimized C code rather than looping in Python. It should cover .map() for element-wise substitution using a dict or function on a Series, .apply() for more general row- or column-wise custom logic when a vectorized alternative doesn't exist, and np.where()/np.select() as vectorized alternatives to an if/elif chain - np.where for a single condition, np.select for multiple ordered conditions with corresponding choices.

### Pivot tables and cross-tabulation

A strong summary should explain that pivot_table() reshapes long-format data into a wide grid, with one column's values becoming new column headers (columns=), another becoming the row index (index=), and a chosen aggregate function (aggfunc=, defaulting to mean) summarizing the values that land in each cell. It should distinguish this from pd.crosstab(), which specifically computes frequency counts (or another aggregate) between two or more categorical columns, and mention the fill_value parameter for handling cells with no matching data.

### Window functions: rolling, cumulative sum, shift/diff

A strong summary should cover .rolling(window).agg() for computing a moving statistic (mean, sum) over a sliding window of rows, .cumsum()/.cumprod() for running totals, .shift() for accessing a prior (or, with a negative argument, a following) row's value within a group, and .diff() as a shortcut for the difference between a row and its shifted counterpart - directly analogous to SQL's LAG(). It should mention that these are almost always used together with groupby() when the calculation needs to reset independently for each group rather than running across the whole DataFrame.

### Ranking and deduplication (latest-record-per-group patterns)

A strong summary should cover .rank() for computing a rank within a group (with the method parameter controlling how ties are handled, e.g. 'min', 'dense', 'first'), and the common 'latest record per group' pattern: sorting by the tiebreak column, then using groupby().head(1) or drop_duplicates(subset=group_cols, keep='last') to keep exactly one row per group - directly analogous to the SQL ROW_NUMBER()-plus-filter pattern.

### Reshaping data: melt, stack/unstack, wide vs long

A strong summary should explain the difference between wide format (each distinct measurement gets its own column) and long/tidy format (one row per single observation, with a column naming which variable it is). It should cover pd.melt() for converting wide data to long (specifying id_vars to keep fixed and value_vars to unpivot), and stack()/unstack() for pivoting a DataFrame's column index into/out of its row index. It should mention that most pandas groupby/aggregation operations expect long-format data, while wide format is often better for direct human reading or certain plotting needs.

### Cohort and retention analysis in pandas

A strong summary should explain the standard pandas cohort pattern: computing each customer's first-activity period (often via groupby().transform('min') on a date column), assigning that as their cohort label, then computing, for each cohort, what fraction of members were still active in each subsequent period relative to the cohort's original size. It should mention that the result is typically reshaped into a cohort-by-period grid (often via pivot_table) for a clean retention-curve view, directly mirroring the SQL cohort pattern but built from groupby/transform/pivot rather than window functions.

### Funnel conversion and rate math in pandas

A strong summary should explain computing, per entity (customer, session), whether each funnel step was reached (often via boolean flags per step), then aggregating those flags to get counts reaching each step, and dividing by a consistent denominator (usually the count reaching the first step) to get conversion rates. It should mention that step-over-step conversion (each step relative to the immediately preceding step) tells a different story from overall conversion (each step relative to the funnel's start), and that both are usually worth computing and reporting together.

### A/B testing & hypothesis testing (t-test, chi-square, confidence intervals)

A strong summary should cover the t-test for comparing means between two groups (e.g. average spend, treatment vs. control) and the chi-square test for comparing proportions/categorical distributions between groups (e.g. conversion rate). It should explain the p-value as the probability of seeing a difference this large (or larger) if there were truly no effect, and that a small p-value (below a chosen significance threshold, commonly 0.05) is evidence against the null hypothesis of no difference. It should mention confidence intervals as a range of plausible values for the true effect size, and that statistical significance alone doesn't guarantee the effect is large enough to matter practically.

### Simulation & probability

A strong summary should explain using numpy's random-sampling functions (e.g. np.random.choice, np.random.binomial, np.random.normal) to simulate a random process many times and empirically observe outcomes, rather than deriving them analytically - useful when an exact formula is hard to derive or verify by hand. It should mention setting a random seed for reproducibility, and the general Monte Carlo pattern: run the simulated process a large number of times, collect the outcome of each run, then summarize the distribution of outcomes (mean, percentiles) to estimate a probability or expected value.

### Core Python: lists, dicts, sets & comprehensions

A strong summary should cover the core built-in data structures and when each is appropriate: lists (ordered, allows duplicates, indexed by position), dicts (key-value pairs, fast lookup by key), and sets (unordered, unique elements only, fast membership testing). It should cover comprehension syntax for building each of these concisely from an iterable (e.g. [x for x in items if condition] for a list comprehension), and mention that a comprehension is generally both more readable and faster than the equivalent explicit for-loop-with-append pattern.

### Core Python: functions, control flow & writing reusable logic

A strong summary should cover defining functions with def, including positional vs. keyword arguments and default parameter values, and standard control flow (if/elif/else, for and while loops). It should mention writing small, reusable functions to avoid repeating the same logic in multiple places, and cover common patterns like early returns to simplify conditional logic, and that mutable default arguments (e.g. a list or dict as a default parameter value) are a well-known Python pitfall worth knowing to avoid.

---

## ML Fundamentals Trainer

### ML workflow & problem framing

A strong summary should explain the distinction between supervised learning (labeled historical outcomes, split into classification for categorical targets and regression for continuous ones) and unsupervised learning (no labels, finding structure like clustering). It should cover the end-to-end workflow order - framing the business problem, defining a precise target variable, engineering features, splitting into train/validation/test, then only later deploying and monitoring - and specifically explain data leakage (a feature that wouldn't genuinely be available at prediction time) as the most common framing mistake. It should mention matching model complexity to the data volume and interpretability needs actually available, rather than defaulting to the most sophisticated option.

### Bias-variance tradeoff & regularization

A strong summary should define bias (error from a model too simple to capture the real pattern, underfitting) and variance (error from a model too sensitive to its specific training sample, overfitting), and explain the diagnostic: comparing training vs. validation performance, where poor performance on both signals bias and a large gap between excellent training and much worse validation performance signals variance. It should cover regularization (Ridge shrinking all coefficients smoothly, Lasso capable of zeroing some out entirely) as the main lever for reducing variance, and explicitly note that more training data helps variance but does little for bias.

### Classification evaluation metrics

A strong summary should define the confusion matrix (TP/FP/FN/TN) and derive precision (TP/(TP+FP), trustworthiness of a positive call) and recall (TP/(TP+FN), completeness of catching real positives) from it, along with F1 as their harmonic mean. It should explain why accuracy is misleading on imbalanced data, and describe AUC as a threshold-independent metric - the probability a random positive example outscores a random negative one - distinct from precision/recall, which depend on a specific chosen threshold.

### Tree-based models

A strong summary should explain how a single decision tree splits data to maximize purity at each step, and why an unconstrained tree tends to overfit (memorizing tiny, specific groups of training rows). It should explain bagging - random forests training many trees independently on random subsets of rows and features, then averaging - as a variance-reduction technique, and contrast this with gradient boosting, which builds trees sequentially, each correcting the errors of the ones before it, generally more accurate but more hyperparameter-sensitive and slower to train since it can't parallelize across trees.

### Linear & logistic regression

A strong summary should explain linear regression as predicting a continuous value via a weighted sum of features plus an intercept, trained by minimizing squared error, with each coefficient describing an association holding other features constant. It should explain why linear regression breaks for a binary target (unbounded output), and how logistic regression fixes this by passing the weighted sum through the sigmoid function to produce a valid probability, trained by minimizing log loss rather than squared error specifically because log loss penalizes confident wrong predictions much more heavily.

### Neural network fundamentals

A strong summary should explain that a neuron computes a weighted sum of inputs plus a bias, then applies an activation function, and that networks stack many neurons into layers (input, hidden, output), with a forward pass computing a prediction layer by layer. It should explain why activation functions must be non-linear - stacking purely linear layers collapses mathematically into one linear transformation, no matter how many layers - and cover gradient descent (nudging weights to reduce a loss function) and backpropagation (the algorithm that efficiently computes every weight's gradient) as the training mechanism.

### Feature engineering & imbalanced data

A strong summary should explain feature engineering as constructing informative, leakage-free, model-usable inputs from raw data (e.g. deriving 'days since last transaction' rather than using a raw timestamp), including encoding categorical variables into numeric form. It should explain why imbalanced data breaks accuracy as a metric and also distorts training itself (the majority class dominates the aggregate loss), and cover the fixes - undersampling, oversampling, and class weighting - along with the critical rule that validation and test sets must keep their original, real-world class proportions.

### Regression evaluation metrics

A strong summary should define MAE (average absolute error, every error counted proportionally) and RMSE (penalizes large errors disproportionately due to squaring), and explain R-squared as the proportion of variance explained relative to a naive 'always predict the average' baseline, including that R-squared can go negative if a model underperforms that baseline. It should cover choosing between these based on the actual cost of errors (RMSE when big misses are especially costly, MAE for a robust, easily-explained typical error), and flag MAPE's instability near zero actual values.

### Cross-validation & hyperparameter tuning

A strong summary should explain why a single train/validation split carries random noise (which rows land where can swing the estimate), and describe k-fold cross-validation as splitting data into k folds, training k times with a different fold held out each time, and averaging the result for a more stable estimate. It should cover using cross-validated performance (not a single split, and never the test set) to compare hyperparameter settings via grid search (exhaustive) or random search (sampled, often more efficient with many hyperparameters), followed by a final, one-time test-set evaluation of the already-chosen model.

### Clustering & customer segmentation

A strong summary should explain clustering as unsupervised - no labels, grouping by similarity/distance - and describe k-means: choosing k upfront, assigning points to the nearest centroid, recomputing centroids, and repeating until stable. It should explain why feature scaling is essential for k-means (unscaled features with larger raw ranges dominate the distance calculation), and explain why picking k by lowest WCSS alone is broken (WCSS always decreases as k increases), motivating the elbow method, silhouette score, and ultimately checking that the resulting segments are actually actionable for the business.

### Causal inference & experimentation

A strong summary should explain the difference between correlation and causation, and define a confounder as a third variable that independently drives both sides of an observed correlation, making it look causal when it isn't. It should explain why randomization in an A/B test solves this - spreading every possible confounder, known or unknown, evenly across treatment and control groups - and cover difference-in-differences (comparing before/after change between treated and comparison groups, relying on a parallel-trends assumption) and propensity score matching (pairing similar likelihood-of-treatment subjects) as quasi-experimental fallbacks when randomization isn't possible.

### Model interpretability & common pitfalls

A strong summary should explain why interpretability matters beyond accuracy - regulatory requirements to explain adverse decisions, debugging, and stakeholder trust - and distinguish global interpretability (overall feature importance, describing the model in general) from local interpretability (explaining one specific prediction). It should cover the common pitfalls: correlated features splitting or hiding true importance, and proxy variables (like zip code standing in for race) letting a model reproduce biased outcomes indirectly even without using a protected characteristic directly, motivating a disparate-impact audit whenever a feature's importance is surprising.

### Deployment, monitoring & drift

A strong summary should distinguish batch scoring (periodic, on stored data) from real-time scoring (on-demand, immediate), and explain training/serving skew as a feature being computed differently in production than during training, causing the live model to see inputs it was never validated against. It should distinguish data drift (the input feature distribution shifting over time) from concept drift (the relationship between features and target itself changing), and explain the monitoring approach given label latency: watching feature and predicted-score distributions in the interim, then recomputing real performance metrics once true labels eventually arrive.

### End-to-end applied case study

A strong summary should walk through applying the full workflow to one concrete scenario end to end: framing a precise target variable and checking for leakage first, choosing an evaluation metric and training approach shaped by the actual class balance (e.g. rejecting accuracy and addressing training-loss distortion under severe imbalance), choosing a model family suited to the data's structure and interpretability needs (e.g. gradient boosting for structured tabular data), and closing with pre-launch validation discipline (cross-validated tuning, a single honest test-set read, a feature-importance sanity check) plus a concrete post-launch monitoring plan given delayed labels.

---
