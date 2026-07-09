const TOPICS = [
  "Candlesticks & market structure basics",
  "Support/resistance & liquidity",
  "Order types & risk management",
  "Trend, BOS & CHoCH",
  "Fair Value Gaps (FVG)",
  "Inverse Fair Value Gaps (IFVG)",
  "Putting it together: building a trade plan",
  "Trading psychology & risk of ruin"
];

const LESSONS = {
  "Candlesticks & market structure basics": {
    "subtopics": [
      {
        "name": "Reading a candlestick",
        "md": "A candlestick shows four prices for one time period: **open**, **high**, **low**, and **close**. The thick part (the \"body\") spans open to close - green/white if close > open (price went up), red/black if close < open (price went down). The thin lines above and below (the \"wicks\" or \"shadows\") show the high and low reached during that period, even if price didn't close there.\n\nA long body means strong, decisive movement in one direction. A long wick with a small body means price was pushed one way and then rejected back - often a sign of a fight between buyers and sellers at that level.\n\n**Note:** Everything in this course is educational. Practice on a demo/paper-trading account before risking real capital, and never risk more than you can afford to lose."
      },
      {
        "name": "Trend vs range",
        "md": "A **trend** is a market that's making a sustained series of moves in one direction - an uptrend prints higher highs and higher lows, a downtrend prints lower highs and lower lows. A **range** (or \"consolidation\") is a market bouncing between a ceiling and a floor with no clear directional progress.\n\nMost of the concepts in this course (FVG, IFVG, BOS, CHoCH) are most reliable in trending conditions - in a tight range, price is choppier and these signals produce more false starts. The first question to ask before analyzing anything else: is this pair trending or ranging right now?"
      },
      {
        "name": "Higher highs/higher lows (market structure)",
        "md": "**Market structure** is the language traders use to describe the sequence of swing highs and swing lows. A swing high is a candle with lower highs on both sides of it (a local peak); a swing low is the mirror image (a local trough).\n\nAn uptrend's structure looks like: higher high (HH) -> higher low (HL) -> higher high -> higher low, each new swing high and swing low sitting above the last. A downtrend is the reverse: lower high (LH) -> lower low (LL) -> lower high -> lower low.\n\nEverything else in this course - breaks of structure, changes of character, fair value gaps - is defined *relative to* this swing-high/swing-low skeleton. If you can't label the swings, you can't apply the rest of the framework."
      }
    ]
  },
  "Support/resistance & liquidity": {
    "subtopics": [
      {
        "name": "Support and resistance zones",
        "md": "**Support** is a price zone where buying pressure has repeatedly stepped in and stopped a decline; **resistance** is the mirror image - a zone where selling has repeatedly capped a rally. Think of these as *zones*, not exact lines - price rarely reacts at the exact same tick twice.\n\nOnce broken, a support level often flips into resistance on a retest (and vice versa) - the same zone, but now the crowd of traders who bought there and are underwater tend to sell into any rally back to their entry, just to break even."
      },
      {
        "name": "Liquidity pools & stop hunts",
        "md": "**Liquidity** in this context means resting orders - specifically, stop-loss and pending orders clustered at an obvious price level. Retail traders tend to place stops just beyond an obvious swing high or swing low, which creates a pool of liquidity sitting right past that level.\n\nA **stop hunt** (or \"liquidity grab\") is when price pushes just beyond that obvious level - triggering the resting stop orders and pending orders - before reversing sharply back the other way. This isn't a conspiracy theory; it's simply that a large order needs counter-side liquidity to fill against, and clusters of stops are exactly that liquidity."
      },
      {
        "name": "Equal highs/lows as liquidity magnets",
        "md": "When price makes two or more swing highs at roughly the same level (\"equal highs\"), or two or more swing lows at roughly the same level (\"equal lows\"), it signals an especially large, obvious pool of resting stops just beyond that level - because *every* trader who faded those tops (or bought those lows) has a stop in roughly the same place.\n\nEqual highs/lows are one of the most common places price runs to next, precisely because the liquidity pooled there is large and easy to identify - which is exactly why it's also easy for you to identify it in advance."
      }
    ]
  },
  "Order types & risk management": {
    "subtopics": [
      {
        "name": "Market vs limit vs stop orders",
        "md": "A **market order** executes immediately at the best available price - fast, but you don't control the exact fill price. A **limit order** only fills at your specified price or better - you control price, but it might never fill if the market doesn't come back to it. A **stop order** sits dormant until price reaches a trigger level, then becomes a market order - commonly used both to enter breakouts and to exit losing positions (a stop-loss)."
      },
      {
        "name": "Stop-loss placement & position sizing",
        "md": "A stop-loss is a stop order that closes your position automatically if price moves against you past a level you define in advance - it caps how much a single trade can lose. **Position sizing** is the separate decision of *how many units/lots* to trade so that if your stop-loss is hit, the dollar loss matches a fixed, small percentage of your account (commonly 1-2% per trade) - not a fixed number of units.\n\nThe stop distance and position size are linked: a stop placed further away (because that's where the trade idea is actually invalidated) means trading a smaller size, not moving the stop closer just to allow a bigger position."
      },
      {
        "name": "Risk:reward ratio",
        "md": "**Risk:reward ratio** compares how much you stand to lose if the trade fails (distance to your stop-loss) against how much you stand to gain if it succeeds (distance to your take-profit target). A 1:2 risk:reward trade risks $1 to make $2.\n\nThis matters because it directly determines your required win rate to break even: at 1:2 risk:reward, you only need to win about 34% of trades to come out ahead over time (ignoring costs); at 1:1, you need to win more than 50%. A trading strategy's edge comes from the combination of win rate *and* risk:reward together, not either one alone."
      }
    ]
  },
  "Trend, BOS & CHoCH": {
    "subtopics": [
      {
        "name": "Break of Structure (BOS)",
        "md": "A **Break of Structure (BOS)** is when price closes beyond the most recent swing high (in an uptrend) or swing low (in a downtrend) - confirming that the existing trend is continuing. In an uptrend, a new higher high that closes above the prior swing high is a bullish BOS; in a downtrend, a new lower low closing below the prior swing low is a bearish BOS.\n\nBOS is a *continuation* signal - it tells you the trend you're already in remains intact, not that a new trend is starting."
      },
      {
        "name": "Change of Character (CHoCH)",
        "md": "A **Change of Character (CHoCH)** is the opposite signal: price breaks structure in the direction *against* the prevailing trend, suggesting the trend may be ending. In an uptrend (higher highs, higher lows), a CHoCH happens when price breaks below the most recent higher low - the first sign that the higher-low pattern has failed.\n\nCHoCH is a warning sign, not proof of a full reversal on its own - many traders wait for a further BOS in the new direction before treating the reversal as confirmed."
      },
      {
        "name": "Combining BOS/CHoCH to read trend direction",
        "md": "In practice, you read a chart as a sequence: BOS, BOS, BOS confirms a trend is healthy and continuing. A CHoCH interrupts that sequence and puts you on alert. If price then goes on to print a BOS *in the new direction* (e.g. after an uptrend's CHoCH, price makes a lower low that breaks the prior swing low), that's confirmation the trend has actually flipped, not just paused.\n\nThis BOS -> CHoCH -> BOS(new direction) sequence is the core mental model for reading market structure shifts, and it's the frame everything else in this course - FVGs, IFVGs, liquidity grabs - gets layered onto."
      }
    ]
  },
  "Fair Value Gaps (FVG)": {
    "subtopics": [
      {
        "name": "What is a Fair Value Gap",
        "md": "A **Fair Value Gap (FVG)** is a three-candle pattern where the 1st and 3rd candles' wicks don't overlap, leaving a visible gap in price - a sign that price moved so fast through that zone that it didn't trade \"fairly\" (didn't get matched on both sides) there. In a bullish FVG, candle 1's high sits below candle 3's low; in a bearish FVG, candle 1's low sits above candle 3's high.\n\nThe theory: because that zone was skipped over rather than traded through normally, price often returns later to \"fill\" the gap - trading back through that zone - before continuing in its original direction, similar to how a rubber band that's stretched too fast tends to snap back a little."
      },
      {
        "name": "Bullish vs bearish FVG",
        "md": "A **bullish FVG** forms during an up-move: candle 1 (before the move) has a high that doesn't reach up to candle 3's low (after the move) - the gap sits below current price and often acts as *support* on a pullback. A **bearish FVG** forms during a down-move: candle 1's low sits above candle 3's high - the gap sits above current price and often acts as *resistance* on a bounce.\n\nA useful shorthand: a bullish FVG is a place you'd look to *buy* a pullback; a bearish FVG is a place you'd look to *sell* a bounce - assuming the broader structure (BOS/CHoCH) supports that direction."
      },
      {
        "name": "Trading the FVG fill",
        "md": "A common approach: wait for price to trade back into an FVG (the \"fill\"), then look for a reaction there - a rejection wick, a lower-timeframe change of character - before entering in the direction of the original move, with a stop placed just beyond the far edge of the gap.\n\nNot every FVG gets filled, and not every fill produces a reaction - treat the FVG as one piece of confluence (see the trade-plan topic later in this course), not a signal to trade in isolation."
      }
    ]
  },
  "Inverse Fair Value Gaps (IFVG)": {
    "subtopics": [
      {
        "name": "What is an Inverse FVG",
        "md": "An **Inverse Fair Value Gap (IFVG)** is what happens when price fully trades *through* an existing FVG rather than just filling and reacting at its edge - the gap's role flips (\"inverts\") from support/resistance in the original direction to support/resistance in the *opposite* direction. A bullish FVG that gets fully violated (price closes below it) becomes a bearish IFVG - now expected to act as resistance if price returns to it."
      },
      {
        "name": "Why an FVG flips to become an IFVG",
        "md": "The logic mirrors the support-flips-to-resistance idea from earlier in this course: traders who entered expecting the original FVG to hold as support are now trapped and underwater once price closes through it, so they tend to sell into any bounce back up to that zone just to exit near breakeven - which is exactly what turns the old support into new resistance.\n\nThe key trigger is a **full close through** the gap, not just a brief wick poking through it - a wick alone doesn't confirm the flip."
      },
      {
        "name": "Using IFVG as a reversal signal",
        "md": "Because an IFVG only forms after price has already violated the original FVG, it's inherently a *later*, more confirmed signal than trading the original FVG fill - you've effectively already seen one failed defense of that zone. Many traders treat a clean IFVG reaction (price returning to the flipped zone and rejecting it) as higher-confidence than trading the first FVG touch, precisely because the market has already shown its hand once."
      }
    ]
  },
  "Putting it together: building a trade plan": {
    "subtopics": [
      {
        "name": "Top-down multi-timeframe analysis",
        "md": "A standard workflow: start on a higher timeframe (e.g. daily or 4-hour) to determine overall trend direction and mark major structure/liquidity levels, then drop to a lower timeframe (e.g. 15-minute or 5-minute) to time a precise entry once price reaches your area of interest. Trading against the higher-timeframe trend is possible but statistically harder - most systematic approaches trade *with* the higher timeframe and use the lower timeframe only for entry timing."
      },
      {
        "name": "Confluence: combining structure + FVG + liquidity",
        "md": "**Confluence** means multiple independent signals lining up at the same price zone: e.g. a bullish FVG sitting right at a prior swing low (support) that also happens to be just below an equal-lows liquidity pool that recently got swept. Any one of these signals alone is a weak reason to trade; several stacking at the same zone is what most price-action traders actually wait for before entering.\n\nA simple pre-trade checklist: what's the higher-timeframe trend? Has structure just shown a BOS or CHoCH? Is there an FVG or IFVG at this level? Has liquidity just been grabbed nearby? The more of these that align, the stronger the case for the trade."
      },
      {
        "name": "Trade journaling basics",
        "md": "A trade journal records, for every trade: the setup/reason for entry (which confluences were present), entry price, stop-loss, target, actual exit, and outcome - plus a note on what you'd do differently. Reviewing a journal over dozens of trades is how you find out whether your edge is real or whether you're pattern-matching on noise; without one, most traders substantially misremember their own win rate."
      }
    ]
  },
  "Trading psychology & risk of ruin": {
    "subtopics": [
      {
        "name": "Emotional discipline & revenge trading",
        "md": "**Revenge trading** is increasing size or abandoning your plan immediately after a loss, trying to \"win it back\" - it's one of the most common ways a small, planned loss turns into a large, unplanned one. The discipline fix is mechanical, not willpower-based: define your risk per trade and your max daily/weekly loss *before* you start trading, and treat hitting that limit as a hard stop for the day, no exceptions."
      },
      {
        "name": "Risk of ruin & position sizing at scale",
        "md": "**Risk of ruin** is the probability that a losing streak - even one consistent with your strategy's normal win rate - wipes out your account, given your position size. Risking 1% per trade survives a long losing streak; risking 10% per trade can be mathematically ruined by a streak that's well within normal statistical variance for even a good strategy. This is why position sizing is treated as a risk-of-ruin problem, not just a per-trade preference."
      },
      {
        "name": "Overtrading & FOMO",
        "md": "**Overtrading** is taking trades that don't actually meet your plan's criteria, often driven by **FOMO** (fear of missing out) after watching a move happen without you in it. The fix is the same mechanical discipline as revenge trading: a written checklist of what a valid setup requires, and a rule that no checklist, no trade - regardless of how compelling the chart looks in the moment."
      }
    ]
  }
};

const QUESTIONS = [
  {
    "diff": "easy",
    "type": "mc",
    "ask": "A candlestick's body is red/black. What does that tell you?",
    "hint": "The body spans open to close.",
    "options": [
      "The high was above the open",
      "The close was below the open",
      "The low was above the close",
      "The candle had no wicks"
    ],
    "correctIndex": 1,
    "explanation": "A red/black body means the close was lower than the open - price fell over that period. Color doesn't tell you anything about the wicks (high/low) on its own.",
    "bonus": false,
    "topic": "Candlesticks & market structure basics",
    "subtopic": "Reading a candlestick",
    "id": 0
  },
  {
    "diff": "medium",
    "type": "written",
    "ask": "A pair has been chopping sideways between two levels for two weeks, with no new highs or lows outside that range. Is this a trend or a range, and why does that distinction matter before you apply concepts like FVG or BOS?",
    "hint": "Think about what higher-highs/higher-lows (or lower-highs/lower-lows) require, and whether this description has them.",
    "modelAnswer": "This is a range, not a trend - a trend requires a sustained sequence of higher highs and higher lows (or lower highs and lower lows), and bouncing between the same two levels for two weeks with no new extremes is the definition of consolidation, not directional progress. The distinction matters because concepts like FVG fills, BOS, and CHoCH are structure-continuation/reversal signals defined relative to a trending sequence of swings - in a tight range there's no clear trend to continue or reverse, so these signals tend to produce more false starts and whipsaws than they would in a trending market.",
    "keyConcepts": [
      "Range = no new highs/lows, bouncing between two levels",
      "Trend requires sustained higher-highs/higher-lows or lower-highs/lower-lows",
      "FVG/BOS/CHoCH are defined relative to trending structure",
      "These signals are less reliable / more false signals in a tight range"
    ],
    "bonus": false,
    "topic": "Candlesticks & market structure basics",
    "subtopic": "Trend vs range",
    "id": 1
  },
  {
    "diff": "hard",
    "type": "mc",
    "ask": "Price has just printed a new swing low that sits BELOW the previous swing low, after a series of lower highs. What best describes the current market structure?",
    "hint": "Compare the new swing low to the previous one, and think about what a downtrend's structure looks like.",
    "options": [
      "Uptrend - higher highs and higher lows",
      "Downtrend - lower highs and lower lows",
      "Range - no clear structure",
      "Impossible to tell without volume data"
    ],
    "correctIndex": 1,
    "explanation": "A new swing low below the previous swing low, combined with a series of lower highs, is exactly the lower-high/lower-low sequence that defines a downtrend.",
    "bonus": false,
    "topic": "Candlesticks & market structure basics",
    "subtopic": "Higher highs/higher lows (market structure)",
    "id": 2
  },
  {
    "topic": "Candlesticks & market structure basics",
    "subtopic": null,
    "diff": "recall",
    "type": "written",
    "recall": true,
    "ask": "Summarize, in your own words, how you'd read a candlestick chart to determine whether a market is trending or ranging, and how you'd label its swing highs and swing lows.",
    "hint": "Explain it the way you'd say it out loud to another trader who hasn't studied this topic yet - cover the core ideas and at least one concrete example.",
    "bonus": false,
    "modelAnswer": "A strong summary covers: a candlestick shows open/high/low/close for a period, with the body (open-to-close) and wicks (the extremes reached) telling different things - body color/size shows the net directional push, wicks show rejection at extremes. Market structure is read by identifying swing highs (local peaks with lower highs on both sides) and swing lows (local troughs with higher lows on both sides); an uptrend prints a sequence of higher highs and higher lows, a downtrend prints lower highs and lower lows, and a range bounces between a ceiling and floor without making new extremes in either direction. Everything else in the course (BOS, CHoCH, FVG, IFVG) is defined relative to this swing skeleton, so being able to label swings correctly is the prerequisite skill.",
    "id": 3
  },
  {
    "diff": "easy",
    "type": "mc",
    "ask": "Price breaks below an old support level, then later rallies back up to retest that same level from below. What would you expect?",
    "hint": "Think about the traders who bought at the old support and are now underwater.",
    "options": [
      "The old support will likely act as new support again",
      "The old support will likely act as new resistance",
      "The level has no further relevance once broken",
      "Price will always gap through the level without reacting"
    ],
    "correctIndex": 1,
    "explanation": "Once support breaks, it commonly flips into resistance - traders who bought at that level and are now underwater tend to sell into any rally back to their entry, capping the bounce.",
    "bonus": false,
    "topic": "Support/resistance & liquidity",
    "subtopic": "Support and resistance zones",
    "id": 4
  },
  {
    "diff": "medium",
    "type": "written",
    "ask": "Explain what a 'stop hunt' is, why it happens (in terms of market mechanics, not conspiracy), and where you'd expect one to occur on a chart.",
    "hint": "Think about where retail traders typically place their stop-loss orders relative to an obvious swing high/low.",
    "modelAnswer": "A stop hunt (liquidity grab) is when price pushes briefly beyond an obvious swing high or swing low - triggering the cluster of stop-loss and pending orders resting just past that level - before reversing sharply the other way. It happens because large orders need counter-side liquidity to fill against, and an obvious level (where many retail traders place stops just beyond it) is exactly where that liquidity is concentrated; it's a mechanical consequence of order flow, not a coordinated conspiracy. You'd expect one right around an obvious recent swing high or swing low, especially one with equal highs/lows nearby, since that's where the largest, most predictable pool of resting stops sits.",
    "keyConcepts": [
      "Stop hunt = price briefly breaks a level to trigger resting stops, then reverses",
      "Explained by need for counter-side liquidity to fill large orders, not conspiracy",
      "Occurs at obvious swing highs/lows where retail stops cluster",
      "Equal highs/equal lows are especially likely locations"
    ],
    "bonus": false,
    "topic": "Support/resistance & liquidity",
    "subtopic": "Liquidity pools & stop hunts",
    "id": 5
  },
  {
    "diff": "hard",
    "type": "mc",
    "ask": "A chart shows two swing highs at nearly the same price, weeks apart. What does this 'equal highs' pattern most likely indicate?",
    "hint": "Think about where every trader who faded both of those tops would have placed their stop.",
    "options": [
      "A random coincidence with no trading significance",
      "A large, obvious pool of resting sell-stop orders just above that level",
      "Confirmation that the pair is in a strong downtrend",
      "Proof that price cannot go higher than that level"
    ],
    "correctIndex": 1,
    "explanation": "Equal highs signal a large, easy-to-identify pool of resting stops just above that level (from traders who faded both tops), making it a likely target for a liquidity grab - not a hard ceiling.",
    "bonus": false,
    "topic": "Support/resistance & liquidity",
    "subtopic": "Equal highs/lows as liquidity magnets",
    "id": 6
  },
  {
    "topic": "Support/resistance & liquidity",
    "subtopic": null,
    "diff": "recall",
    "type": "written",
    "recall": true,
    "ask": "In your own words, explain the relationship between support/resistance, liquidity, and stop hunts - how do these three ideas connect?",
    "hint": "Explain it the way you'd say it out loud to another trader who hasn't studied this topic yet - cover the core ideas and at least one concrete example.",
    "bonus": false,
    "modelAnswer": "A strong summary covers: support and resistance are zones where buying or selling has repeatedly reacted, and once broken they tend to flip roles (old support becomes new resistance) because traders trapped on the wrong side defend their breakeven. Liquidity refers to resting stop and pending orders, which cluster just beyond obvious support/resistance levels - especially where equal highs or equal lows make the level easy for everyone to identify. A stop hunt connects these: price pushes just past an obvious support/resistance level specifically to trigger that resting liquidity, providing the counter-side volume a large order needs, before reversing back in the original direction.",
    "id": 7
  },
  {
    "diff": "easy",
    "type": "mc",
    "ask": "You want to guarantee your entry price won't be worse than a specific level, even if it means the order might never fill. Which order type should you use?",
    "hint": "Compare market vs limit vs stop orders on the price-control-vs-fill-certainty tradeoff.",
    "options": [
      "Market order",
      "Limit order",
      "Stop order",
      "Any order type - they're all equivalent"
    ],
    "correctIndex": 1,
    "explanation": "A limit order only fills at your specified price or better, giving you price control at the cost of fill certainty - exactly the tradeoff described.",
    "bonus": false,
    "topic": "Order types & risk management",
    "subtopic": "Market vs limit vs stop orders",
    "id": 8
  },
  {
    "diff": "medium",
    "type": "written",
    "ask": "Explain why position size and stop-loss distance are linked decisions rather than two independent choices - what mistake does a trader make if they treat them as independent?",
    "hint": "Think about what happens to your dollar risk if you widen your stop but keep the same position size.",
    "modelAnswer": "Position size should be calculated backward from a fixed dollar (or percentage) risk and the stop-loss distance: given how far away the stop needs to be for the trade idea to still be valid, position size is whatever quantity makes that stop distance equal your intended risk amount. The common mistake is treating them as independent - picking a position size first (or a habitual size) and then placing whatever stop 'feels right,' which means the actual dollar risk on any given trade is essentially random and can vary wildly between trades even though the trader believes they're being consistent. An equally common variant of the mistake is moving the stop closer just to justify a bigger position, which shrinks the stop's room to be right and gets the trader stopped out by normal noise more often.",
    "keyConcepts": [
      "Position size should be derived from stop distance + fixed risk %, not chosen independently",
      "Fixed risk per trade (e.g. 1-2% of account) is the anchor",
      "Treating them independently makes actual dollar risk inconsistent/random across trades",
      "Moving the stop closer just to allow bigger size is a related mistake"
    ],
    "bonus": false,
    "topic": "Order types & risk management",
    "subtopic": "Stop-loss placement & position sizing",
    "id": 9
  },
  {
    "diff": "hard",
    "type": "mc",
    "ask": "A trade risks $100 to potentially make $300 (risk:reward of 1:3). Roughly what win rate does this trade need just to break even over many trades, ignoring costs?",
    "hint": "At 1:3, for every 4 trades you'd need to make back what 3 losses cost you.",
    "options": [
      "About 75%",
      "About 50%",
      "About 34%",
      "About 25%"
    ],
    "correctIndex": 3,
    "explanation": "At 1:3 risk:reward, breakeven win rate is roughly 1/(1+3) = 25% - lose 3 times ($300 total) and win once ($300) and you're flat, ignoring costs.",
    "bonus": false,
    "topic": "Order types & risk management",
    "subtopic": "Risk:reward ratio",
    "id": 10
  },
  {
    "topic": "Order types & risk management",
    "subtopic": null,
    "diff": "recall",
    "type": "written",
    "recall": true,
    "ask": "Summarize how order types, stop-loss placement, position sizing, and risk:reward ratio all fit together into a single risk-management approach.",
    "hint": "Explain it the way you'd say it out loud to another trader who hasn't studied this topic yet - cover the core ideas and at least one concrete example.",
    "bonus": false,
    "modelAnswer": "A strong summary covers: order types (market/limit/stop) are the mechanical tools - a stop order in particular doubles as both a breakout-entry tool and a stop-loss exit tool. Stop-loss placement should be set at the point where the original trade idea is actually invalidated, not at an arbitrary distance; position size is then derived backward from that stop distance so the dollar risk matches a fixed, small percentage of the account (commonly 1-2%) on every trade, rather than a fixed number of units. Risk:reward ratio (stop distance vs. target distance) then determines the win rate needed to be profitable over time - a favorable risk:reward means you can be wrong more often than right and still come out ahead, which is why professional risk management treats win rate and risk:reward as a single combined edge, not two separate metrics.",
    "id": 11
  },
  {
    "diff": "easy",
    "type": "mc",
    "ask": "In an established uptrend, price makes a new high that closes above the previous swing high. What is this called?",
    "hint": "This confirms the existing trend is continuing.",
    "options": [
      "Change of Character (CHoCH)",
      "Break of Structure (BOS)",
      "Liquidity grab",
      "Fair Value Gap"
    ],
    "correctIndex": 1,
    "explanation": "A close beyond the prior swing high (in an uptrend) or swing low (in a downtrend) that continues the existing trend is a Break of Structure (BOS).",
    "bonus": false,
    "topic": "Trend, BOS & CHoCH",
    "subtopic": "Break of Structure (BOS)",
    "id": 12
  },
  {
    "diff": "medium",
    "type": "written",
    "ask": "An uptrend has been making higher highs and higher lows. Price then breaks below the most recent higher low. What is this event called, and why is it treated as a warning sign rather than confirmed proof of a reversal?",
    "hint": "Think about what specifically has failed, and what further confirmation traders usually wait for.",
    "modelAnswer": "This is a Change of Character (CHoCH) - the first break in the higher-low pattern that had been defining the uptrend, signaling the trend may be ending. It's treated as a warning rather than confirmed reversal because a single broken higher low doesn't yet prove the direction has flipped - it only shows the prior pattern has failed once. Traders typically wait for a further Break of Structure in the new (downward) direction - i.e. a new lower low that breaks the level established after the CHoCH - before treating the reversal as confirmed, since price can and sometimes does resume the original uptrend after just one CHoCH.",
    "keyConcepts": [
      "CHoCH = break of structure against the prevailing trend",
      "In an uptrend, CHoCH = breaking the most recent higher low",
      "CHoCH signals a possible reversal but isn't confirmation on its own",
      "Confirmation typically requires a further BOS in the new direction"
    ],
    "bonus": false,
    "topic": "Trend, BOS & CHoCH",
    "subtopic": "Change of Character (CHoCH)",
    "id": 13
  },
  {
    "diff": "hard",
    "type": "mc",
    "ask": "You see this sequence on a chart: uptrend with several BOS, then a CHoCH, then price goes on to make a new lower low that breaks the post-CHoCH swing low. How would you interpret this?",
    "hint": "Think about what a BOS in the new (downward) direction, following a CHoCH, is meant to confirm.",
    "options": [
      "The uptrend is still fully intact and the CHoCH should be ignored",
      "This sequence confirms the trend has likely flipped to a downtrend",
      "This is meaningless without volume data",
      "This proves price will never make a new high again"
    ],
    "correctIndex": 1,
    "explanation": "CHoCH followed by a BOS in the new direction is the standard confirmation sequence for a trend actually flipping, rather than just a temporary pause in the prior trend.",
    "bonus": false,
    "topic": "Trend, BOS & CHoCH",
    "subtopic": "Combining BOS/CHoCH to read trend direction",
    "id": 14
  },
  {
    "topic": "Trend, BOS & CHoCH",
    "subtopic": null,
    "diff": "recall",
    "type": "written",
    "recall": true,
    "ask": "Explain, in your own words, the difference between a Break of Structure (BOS) and a Change of Character (CHoCH), and how a trader combines the two to read whether a trend is continuing or reversing.",
    "hint": "Explain it the way you'd say it out loud to another trader who hasn't studied this topic yet - cover the core ideas and at least one concrete example.",
    "bonus": false,
    "modelAnswer": "A strong summary covers: BOS is a continuation signal - price closing beyond the most recent swing high (uptrend) or swing low (downtrend), confirming the existing trend remains intact. CHoCH is the opposite - price breaking structure against the prevailing trend (e.g. breaking the most recent higher low in an uptrend), which warns that the trend may be ending but isn't proof on its own. The combined reading is sequential: a series of BOS confirms a healthy trend, a CHoCH interrupts that sequence and puts the trader on alert, and a further BOS in the new direction after the CHoCH is what most traders treat as actual confirmation that the trend has reversed rather than just paused.",
    "id": 15
  },
  {
    "diff": "easy",
    "type": "mc",
    "ask": "In a 3-candle Fair Value Gap, what defines a bullish FVG?",
    "hint": "Think about which candle's high compares to which candle's low.",
    "options": [
      "Candle 1's high sits below candle 3's low",
      "Candle 1's low sits above candle 3's high",
      "All three candles are the same color",
      "Candle 2 has no wicks at all"
    ],
    "correctIndex": 0,
    "explanation": "A bullish FVG forms when candle 1's high doesn't reach candle 3's low, leaving an unfilled gap below current price - a sign the middle candle skipped through that zone.",
    "bonus": false,
    "topic": "Fair Value Gaps (FVG)",
    "subtopic": "What is a Fair Value Gap",
    "id": 16
  },
  {
    "diff": "medium",
    "type": "written",
    "ask": "Explain why an FVG forms in the first place (what does it say about how price moved through that zone), and why traders expect price to often return to 'fill' it.",
    "hint": "Think about what it means for candle 1 and candle 3's wicks to not overlap.",
    "modelAnswer": "An FVG forms when price moves so fast in one direction across three candles that the 1st and 3rd candles' wicks don't overlap - meaning that middle zone was skipped over rather than traded through normally, so orders on both sides of the market weren't fully matched there (an 'inefficiency' in price delivery). Because that zone wasn't traded 'fairly,' the theory is that price often returns later to trade back through it and match up that missing liquidity, similar to a rubber band snapping back after being stretched too quickly - before, in many cases, continuing in the original direction once the gap is filled.",
    "keyConcepts": [
      "FVG = 3-candle pattern where candle 1 and candle 3 wicks don't overlap",
      "Represents an inefficiency/imbalance - price moved too fast to trade fairly through that zone",
      "Market often returns to 'fill' the gap by trading back through it",
      "Often continues in original direction after the fill"
    ],
    "bonus": false,
    "topic": "Fair Value Gaps (FVG)",
    "subtopic": "Bullish vs bearish FVG",
    "id": 17
  },
  {
    "diff": "hard",
    "type": "mc",
    "ask": "Price fills a bullish FVG and shows a rejection wick right at the gap's edge, in line with the higher-timeframe uptrend. What would a trader typically do next, per this course's approach?",
    "hint": "Think about where the invalidation point for this idea would sit.",
    "options": [
      "Enter long, with a stop placed just beyond the far edge of the gap",
      "Enter short immediately, since the gap has now been filled",
      "Ignore the reaction entirely and wait for a new FVG to form",
      "Increase position size since the FVG guarantees the trade will win"
    ],
    "correctIndex": 0,
    "explanation": "The standard approach is entering in the direction of the original move (long, since it's a bullish FVG in an uptrend) with a stop just beyond the gap's far edge - not treating the fill itself as a reversal signal or a guarantee.",
    "bonus": false,
    "topic": "Fair Value Gaps (FVG)",
    "subtopic": "Trading the FVG fill",
    "id": 18
  },
  {
    "topic": "Fair Value Gaps (FVG)",
    "subtopic": null,
    "diff": "recall",
    "type": "written",
    "recall": true,
    "ask": "Explain what a Fair Value Gap is, how a bullish FVG differs from a bearish one, and what a trader typically does when price returns to fill one.",
    "hint": "Explain it the way you'd say it out loud to another trader who hasn't studied this topic yet - cover the core ideas and at least one concrete example.",
    "bonus": false,
    "modelAnswer": "A strong summary covers: an FVG is a 3-candle pattern where the 1st and 3rd candles' wicks don't overlap, representing a zone price moved through too quickly to trade 'fairly' - an inefficiency the market often revisits. A bullish FVG forms during an up-move (candle 1's high below candle 3's low) and sits below price, often acting as support on a pullback; a bearish FVG forms during a down-move (candle 1's low above candle 3's high) and sits above price, often acting as resistance on a bounce. When price returns to fill an FVG, traders typically wait for a reaction (a rejection wick or lower-timeframe confirmation) before entering in the direction of the original move, with a stop placed just beyond the gap's far edge - treating the FVG as one piece of confluence rather than a standalone signal.",
    "id": 19
  },
  {
    "diff": "easy",
    "type": "mc",
    "ask": "What is an Inverse Fair Value Gap (IFVG)?",
    "hint": "Think about what happens when price doesn't just fill an FVG, but fully trades through it.",
    "options": [
      "A second FVG that forms right next to the first one",
      "An FVG whose role has flipped after price fully closes through it",
      "Any FVG found on a lower timeframe",
      "A gap that occurs only on weekend market opens"
    ],
    "correctIndex": 1,
    "explanation": "An IFVG is what an FVG becomes once price fully closes through it - the zone's expected role flips from support/resistance in the original direction to the opposite direction.",
    "bonus": false,
    "topic": "Inverse Fair Value Gaps (IFVG)",
    "subtopic": "What is an Inverse FVG",
    "id": 20
  },
  {
    "diff": "medium",
    "type": "written",
    "ask": "A bullish FVG that had been acting as support gets fully closed through to the downside. Explain, in terms of trader behavior, why that same zone often becomes resistance afterward (i.e. why it becomes a bearish IFVG).",
    "hint": "Think about the traders who bought expecting the original FVG to hold, and where their positions now sit relative to price.",
    "modelAnswer": "Traders who bought in that zone expecting the bullish FVG to hold as support are now underwater once price closes below it, and many of them will look to sell into any rally back up to that zone just to exit near breakeven rather than take a larger loss. That collective selling pressure - the same mechanism that turns broken support into new resistance generally - is exactly what causes the old bullish FVG to act as resistance going forward, i.e. to become a bearish IFVG. The key trigger is a full candle close through the gap, not just a brief wick poking through it, since a wick alone doesn't confirm that enough of those original buyers are actually trapped.",
    "keyConcepts": [
      "IFVG forms when the original FVG is fully closed through (not just wicked)",
      "Traders who entered on the original FVG are now trapped/underwater",
      "Those trapped traders sell into a return to the zone, flipping it to resistance",
      "Same underlying mechanism as support flipping to resistance generally"
    ],
    "bonus": false,
    "topic": "Inverse Fair Value Gaps (IFVG)",
    "subtopic": "Why an FVG flips to become an IFVG",
    "id": 21
  },
  {
    "diff": "hard",
    "type": "mc",
    "ask": "Why might a trader treat a reaction at an IFVG as higher-confidence than trading the very first touch of the original FVG?",
    "hint": "Think about how much the market has already 'shown its hand' by the time an IFVG exists.",
    "options": [
      "IFVGs are guaranteed to work, unlike regular FVGs",
      "The market has already shown one failed defense of that zone, which the original FVG touch hasn't yet demonstrated",
      "IFVGs only form on the daily timeframe, which is inherently more reliable",
      "There is no meaningful difference in confidence between the two"
    ],
    "correctIndex": 1,
    "explanation": "An IFVG only exists after price has already violated the original FVG once - meaning the market has already demonstrated a failed defense of that zone, which is information you don't yet have on a first FVG touch.",
    "bonus": false,
    "topic": "Inverse Fair Value Gaps (IFVG)",
    "subtopic": "Using IFVG as a reversal signal",
    "id": 22
  },
  {
    "topic": "Inverse Fair Value Gaps (IFVG)",
    "subtopic": null,
    "diff": "recall",
    "type": "written",
    "recall": true,
    "ask": "Explain what an Inverse Fair Value Gap is, why the flip from FVG to IFVG happens, and why some traders treat it as a higher-confidence signal than the original FVG.",
    "hint": "Explain it the way you'd say it out loud to another trader who hasn't studied this topic yet - cover the core ideas and at least one concrete example.",
    "bonus": false,
    "modelAnswer": "A strong summary covers: an IFVG is what an FVG becomes once price fully closes through it (not just wicks through it) - the zone's expected role inverts from support/resistance in the original direction to the opposite direction. The flip happens because traders who entered on the original FVG expecting it to hold are now trapped once price closes through it, and their subsequent selling (or buying, in the bearish-to-bullish case) into any return to that zone is what turns old support into new resistance (or vice versa) - the same mechanism as any support/resistance flip, just applied to an FVG specifically. Because an IFVG only exists after the market has already shown one failed defense of that zone, some traders treat a clean reaction at an IFVG as higher-confidence than trading the very first touch of the original FVG, since it reflects more confirmed information about how that zone is actually trading.",
    "id": 23
  },
  {
    "diff": "easy",
    "type": "mc",
    "ask": "In a standard top-down multi-timeframe workflow, what's the primary purpose of checking a higher timeframe (like daily or 4-hour) first?",
    "hint": "Think about what you're trying to establish before you zoom into entry timing.",
    "options": [
      "To find the exact entry price down to the pip/tick",
      "To determine overall trend direction and mark major levels before timing an entry on a lower timeframe",
      "To place your stop-loss order",
      "Higher timeframes are only useful for placing take-profit targets"
    ],
    "correctIndex": 1,
    "explanation": "The higher timeframe establishes overall trend direction and major structure/liquidity levels; the lower timeframe is then used to time a precise entry once price reaches an area of interest.",
    "bonus": false,
    "topic": "Putting it together: building a trade plan",
    "subtopic": "Top-down multi-timeframe analysis",
    "id": 24
  },
  {
    "diff": "medium",
    "type": "written",
    "ask": "Explain what 'confluence' means in this context, and walk through an example of two or three signals from this course that might stack together at the same price zone.",
    "hint": "Think about combining structure (BOS/CHoCH), FVG/IFVG, and liquidity concepts from earlier topics.",
    "modelAnswer": "Confluence means multiple independent signals lining up at the same price zone, making that zone a stronger case for a trade than any single signal would justify alone. An example: a bullish FVG sitting right at a prior swing low that also happens to sit just below a recent equal-lows liquidity pool - if price sweeps below the equal lows (grabbing that liquidity), then reacts right at the FVG and swing-low zone, and the higher timeframe is still in an uptrend, that's three signals (liquidity grab, FVG, and trend alignment) stacking at one level, which is a materially stronger setup than trading the FVG in isolation with no other confirmation.",
    "keyConcepts": [
      "Confluence = multiple independent signals aligning at the same price zone",
      "Single signals alone are weak; several stacking together is stronger",
      "Example should combine at least two of: structure (BOS/CHoCH), FVG/IFVG, liquidity/equal highs-lows, higher-timeframe trend"
    ],
    "bonus": false,
    "topic": "Putting it together: building a trade plan",
    "subtopic": "Confluence: combining structure + FVG + liquidity",
    "id": 25
  },
  {
    "diff": "hard",
    "type": "mc",
    "ask": "Why do most systematic price-action traders avoid taking trades against the higher-timeframe trend, even when a lower-timeframe setup looks compelling?",
    "hint": "Think about which direction has statistically more room and more supporting structure behind it.",
    "options": [
      "Trading against the higher-timeframe trend is illegal on most brokers",
      "It's statistically harder - trading with the dominant higher-timeframe trend has more supporting structure and historically better odds",
      "Lower timeframes are never accurate, regardless of direction",
      "There's no real difference in difficulty between the two"
    ],
    "correctIndex": 1,
    "explanation": "Trading against the dominant higher-timeframe trend is statistically harder since you're fighting the larger structural bias; most systematic approaches use the lower timeframe only for entry timing within the higher-timeframe direction.",
    "bonus": false,
    "topic": "Putting it together: building a trade plan",
    "subtopic": "Trade journaling basics",
    "id": 26
  },
  {
    "topic": "Putting it together: building a trade plan",
    "subtopic": null,
    "diff": "recall",
    "type": "written",
    "recall": true,
    "ask": "Walk through, end to end, how you'd combine top-down analysis, confluence, and journaling into a single repeatable trade-planning process.",
    "hint": "Explain it the way you'd say it out loud to another trader who hasn't studied this topic yet - cover the core ideas and at least one concrete example.",
    "bonus": false,
    "modelAnswer": "A strong summary covers: start on a higher timeframe to establish overall trend direction and mark major structure/liquidity levels, then drop to a lower timeframe to time entries only once price reaches one of those marked areas of interest. Before entering, run a confluence checklist - higher-timeframe trend direction, recent BOS/CHoCH, presence of an FVG or IFVG at this level, and any recent liquidity grab nearby - and look for several of these to align rather than trading off any single one. After the trade closes, log it in a trade journal (setup/reasoning, entry, stop, target, actual exit, and outcome) so that over dozens of trades you can review whether the confluence-based edge is real, rather than relying on memory, which tends to misremember actual win rate.",
    "id": 27
  },
  {
    "diff": "easy",
    "type": "mc",
    "ask": "After taking a loss, a trader immediately doubles their position size on the next trade to 'win it back.' What is this behavior called?",
    "hint": "This is one of the most common ways a small planned loss becomes a large unplanned one.",
    "options": [
      "Position sizing",
      "Revenge trading",
      "Confluence",
      "Risk of ruin"
    ],
    "correctIndex": 1,
    "explanation": "Increasing size or abandoning your plan right after a loss to try to 'win it back' is revenge trading - a discipline failure, not a strategy.",
    "bonus": false,
    "topic": "Trading psychology & risk of ruin",
    "subtopic": "Emotional discipline & revenge trading",
    "id": 28
  },
  {
    "diff": "medium",
    "type": "written",
    "ask": "Explain what 'risk of ruin' means, and why risking 10% of an account per trade is dramatically riskier than risking 1% per trade, even if both use the exact same underlying strategy and win rate.",
    "hint": "Think about how a normal losing streak (one within the strategy's expected variance) interacts with each risk level.",
    "modelAnswer": "Risk of ruin is the probability that a losing streak - even one that's entirely normal and expected given the strategy's real win rate - wipes out the account, purely as a function of position size. At 1% risk per trade, even a long losing streak only erodes the account gradually and leaves plenty of capital to recover once the strategy's edge reasserts itself. At 10% risk per trade, a losing streak that's well within normal statistical variance for even a genuinely profitable strategy can compound down to a catastrophic drawdown or full ruin, because each loss is ten times larger relative to the account - the strategy's long-run edge never gets the chance to play out if the account is wiped first.",
    "keyConcepts": [
      "Risk of ruin = probability that normal variance/losing streaks wipe out the account",
      "Function of position size, not just win rate or strategy quality",
      "1% risk survives normal losing streaks; 10% risk can be ruined by the same streak",
      "A good strategy's long-run edge is irrelevant if the account is ruined before it plays out"
    ],
    "bonus": false,
    "topic": "Trading psychology & risk of ruin",
    "subtopic": "Risk of ruin & position sizing at scale",
    "id": 29
  },
  {
    "diff": "hard",
    "type": "mc",
    "ask": "A trader keeps entering trades that don't meet their own written setup criteria, mainly because they're afraid of missing a move they're watching happen. What is this called, and what's the standard fix?",
    "hint": "Think about the emotion driving the behavior, and what kind of rule (not willpower) fixes it.",
    "options": [
      "Confluence; the fix is adding more indicators",
      "Overtrading/FOMO; the fix is a written checklist with a strict no-checklist-no-trade rule",
      "Risk of ruin; the fix is increasing position size to compensate",
      "Revenge trading; the fix is taking a break from trading entirely"
    ],
    "correctIndex": 1,
    "explanation": "This is overtrading driven by FOMO; the standard fix is mechanical - a written checklist of what a valid setup requires, with a strict rule that no checklist match means no trade, regardless of how compelling the chart looks.",
    "bonus": false,
    "topic": "Trading psychology & risk of ruin",
    "subtopic": "Overtrading & FOMO",
    "id": 30
  },
  {
    "topic": "Trading psychology & risk of ruin",
    "subtopic": null,
    "diff": "recall",
    "type": "written",
    "recall": true,
    "ask": "Summarize the main psychological failure modes covered in this topic (revenge trading, risk of ruin, overtrading/FOMO) and explain what they have in common in terms of how they're fixed.",
    "hint": "Explain it the way you'd say it out loud to another trader who hasn't studied this topic yet - cover the core ideas and at least one concrete example.",
    "bonus": false,
    "modelAnswer": "A strong summary covers: revenge trading is increasing size or abandoning a plan right after a loss to try to win it back; risk of ruin is the probability that a normal losing streak wipes out the account, driven by position size rather than strategy quality; overtrading/FOMO is taking trades that don't meet your own criteria out of fear of missing a move. What they have in common is that all three are fixed the same way - not through willpower in the moment, but through mechanical, pre-committed rules decided before trading starts: a fixed risk percentage per trade, a hard daily/weekly loss limit, and a written setup checklist with a strict no-checklist-no-trade rule - removing the in-the-moment decision entirely.",
    "id": 31
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
      html+='<button class="qbtn'+(solved.has(q.id)?" done":"")+(q.bonus?" bonus":"")+(q.recall?" recall":"")+'" data-i="'+i+'"><span class="dot">'+(solved.has(q.id)?"✓":"")+'</span><span class="star">'+(flagged.has(q.id)?"★":"")+'</span><span class="tagpill tagpill-'+(q.type||"mixed")+'">'+(q.recall?"":(q.type==="mc"?"MC":"Q&A"))+'</span><span class="lbl">'+label+'</span></button>';
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
      +'<textarea id="writtenAnswer" style="display:none" spellcheck="true" placeholder="Type your answer here - a few sentences covering the key ideas is plenty. Talk through it the way you would out loud when explaining a trade idea."></textarea>'
      +'<div id="mcOptions" class="mc-options" style="display:none"></div>'
    +'</div>'
    +'<div class="actions">'
      +'<button class="act run" id="checkAnswerBtn" style="display:none">Check answer</button>'
      +'<button class="act" id="solBtn">Show answer</button>'
      +'<button class="act" id="explainBtn">Explain solution</button>'
      +'<button class="act" id="explainWrongBtn" style="display:none">Explain my error</button>'
      +'<select id="explainModel" class="explain-model"><option value="sonnet">Sonnet 5</option><option value="haiku">Haiku 4.5</option></select>'
      +'<button class="act" id="resetBtn">Clear</button>'
      +'<button class="act" id="prevBtn">&larr; Previous</button><button class="act" id="nextBtn">Next &rarr;</button>'
      +'<span class="kbd">Cmd / Ctrl + Enter &middot; Shift + &larr;/&rarr;</span>'
    +'</div>'
    +'<div class="verdict" id="verdict"><span class="ic" id="vic"></span><span id="vmsg"></span></div>'
    +'<div class="solution" id="solution"><div class="lbl" id="solutionLbl">Model answer</div><pre id="solText" style="display:none"></pre><div id="solProse" style="display:none"></div></div>'
    +'<div class="explainbox" id="explainBox" style="display:none"><div class="lbl" id="explainLbl">Claude explains</div><div id="explainText"></div></div>'
    +'</main>';
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
  document.getElementById("writtenAnswer").style.display=type==="written"?"block":"none";
  document.getElementById("mcOptions").style.display=type==="mc"?"block":"none";
  document.getElementById("checkAnswerBtn").style.display=type==="written"?"":"none";
  document.getElementById("solBtn").style.display=type==="mc"?"none":"";
}

function renderMcOptions(q){
  const box=document.getElementById("mcOptions");
  box.innerHTML=q.options.map((opt,idx)=>
    '<button class="mc-opt" data-idx="'+idx+'">'+opt+'</button>'
  ).join("");
  box.querySelectorAll(".mc-opt").forEach(btn=>{
    btn.addEventListener("click",()=>chooseMcOption(+btn.dataset.idx));
  });
}

function chooseMcOption(idx){
  const q=QUESTIONS[current];
  const box=document.getElementById("mcOptions");
  const correct=idx===q.correctIndex;
  box.querySelectorAll(".mc-opt").forEach((btn,i)=>{
    btn.classList.remove("correct","incorrect");
    if(i===q.correctIndex && (correct || btn.dataset.revealed)) btn.classList.add("correct");
  });
  const chosenBtn=box.querySelector('.mc-opt[data-idx="'+idx+'"]');
  if(!correct) chosenBtn.classList.add("incorrect");
  else chosenBtn.classList.add("correct");
  box.querySelectorAll(".mc-opt").forEach(btn=>{btn.dataset.revealed="1";});
  const verdict=document.getElementById("verdict"),vic=document.getElementById("vic"),vmsg=document.getElementById("vmsg");
  verdict.className="verdict "+(correct?"ok":"no");
  vic.textContent=correct?"✓":"✗";
  vmsg.textContent=correct?q.explanation:"Not quite - "+q.explanation;
  savedAnswers[q.id]=String(idx);
  logAttempt(q.id,q.options[idx],correct);
  if(correct) markSolved(current);
  setExplainWrongVisible(!correct);
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
  setAnswerAreaForType(q.recall?"written":q.type);
  document.getElementById("verdict").className="verdict";
  document.getElementById("solution").className="solution";
  document.getElementById("explainBox").style.display="none";
  setExplainWrongVisible(false);
  const solLbl=document.getElementById("solutionLbl"),solText=document.getElementById("solText"),solProse=document.getElementById("solProse");
  if(q.recall){
    solLbl.textContent="What a strong summary should cover";
    solText.style.display="none";
    solProse.style.display="block";solProse.innerHTML=renderMarkdown(q.modelAnswer);
    document.getElementById("writtenAnswer").value=savedAnswers[q.id]||"";
  }else if(q.type==="written"){
    solLbl.textContent="Model answer";
    solText.style.display="none";
    solProse.style.display="block";solProse.innerHTML=renderMarkdown(q.modelAnswer);
    document.getElementById("writtenAnswer").value=savedAnswers[q.id]||"";
  }else{
    renderMcOptions(q);
  }
  const reqLen=topicRequiredIndices(q.topic).length;setReadystrip(q.topic,topicDone(q.topic),reqLen);
  document.querySelectorAll(".qbtn").forEach(b=>b.classList.toggle("active",+b.dataset.i===i));
  document.getElementById("prevBtn").disabled=(i===0);
  document.getElementById("nextBtn").disabled=(i===QUESTIONS.length-1);
  document.querySelector("main").scrollIntoView({behavior:"smooth",block:"start"});
  if(q.recall || q.type==="written") document.getElementById("writtenAnswer").focus({preventScroll:true});
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

const CONCEPT_PASS_THRESHOLD=0.7;
function parseConceptCoverage(content){
  const m=/^COVERED:\s*(\d+)\s*\/\s*(\d+)/m.exec(content);
  if(!m) return null;
  const covered=+m[1],total=+m[2];
  if(!total) return null;
  const pct=Math.round(covered/total*100);
  const rest=content.slice(m.index+m[0].length).replace(/^\s*\n+/,"");
  return {covered,total,pct,rest};
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
    const payload={track:"trading",mode:"trainer",questionId:q.id,kind:"grade",ask:q.ask,solution:q.modelAnswer,studentAnswer:answer,model:getExplainModel()};
    if(q.keyConcepts && q.keyConcepts.length) payload.keyConcepts=q.keyConcepts;
    const r=await requestExplanation(payload);
    const coverage=parseConceptCoverage(r.content);
    let passed;
    if(coverage){
      passed=coverage.pct>=CONCEPT_PASS_THRESHOLD*100;
      txt.innerHTML='<div class="coverage-badge '+(passed?"ok":"no")+'"><span class="coverage-pct">'+coverage.pct+'%</span><span class="coverage-frac">'+coverage.covered+' of '+coverage.total+' key concepts covered</span><div class="coverage-bar"><i style="width:'+coverage.pct+'%"></i></div></div>'+renderMarkdown(coverage.rest);
      vmsg.textContent=passed?coverage.pct+"% of key concepts covered - graded as strong.":coverage.pct+"% of key concepts covered - see feedback below for what's missing.";
    }else{
      passed=/\*\*strong\*\*/i.test(r.content) || /^strong/i.test(r.content.replace(/[*_]/g,""));
      txt.innerHTML=renderMarkdown(r.content);
      vmsg.textContent=passed?"Graded as strong - see feedback below.":"See feedback below for what to add.";
    }
    box.scrollIntoView({behavior:"smooth",block:"nearest"});
    verdict.className="verdict "+(passed?"ok":"no");
    vic.textContent=passed?"✓":"~";
    logAttempt(q.id,answer,passed);
    if(passed) markSolved(current);
  }catch(e){
    txt.textContent=e.message;
  }finally{
    btn.disabled=false;btn.textContent=orig;
    lbl.textContent="Claude explains";
  }
}

function doRun(){
  const q=QUESTIONS[current];
  if(q.recall || q.type==="written") return doCheckWritten();
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
  return supabaseClient.from("attempts").select("question_id,passed,query_text,created_at").eq("mode","trainer").eq("track","trading").order("created_at",{ascending:true})
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
  return fetchFlaggedIds("trading","trainer").then(ids=>ids.forEach(id=>flagged.add(id)));
}

function toggleFlag(id){
  const on=!flagged.has(id);
  if(on) flagged.add(id); else flagged.delete(id);
  setQuestionFlag("trading","trainer",id,on);
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
    const refSolution=q.type==="mc" ?
      "Correct answer: "+q.options[q.correctIndex]+". "+q.explanation :
      q.modelAnswer;
    const payload={track:"trading",mode:"trainer",questionId:q.id,kind,ask:q.ask,prompt:"",solution:refSolution,model:getExplainModel()};
    if(kind==="attempt"){
      payload.userCode=savedAnswers[q.id]||"";
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
  supabaseClient.from("attempts").insert({question_id:questionId,query_text:answerText,passed,mode:"trainer",track:"trading"}).then(()=>{});
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

requireAuth().then(()=>Promise.all([hydrateProgress(),hydrateFlags()]))
.then(()=>{
  const app=document.getElementById("app");app.className="";
  app.innerHTML='<div class="wrap"><aside id="sidebar">'+buildSidebarFilterBar()+buildSidebar()+'</aside>'+buildMain()+'<div class="col-resizer" id="colResizer"></div><div class="right-col" id="rightCol"></div></div>';
  document.getElementById("totalCount").textContent=requiredCount();
  document.querySelectorAll(".qbtn").forEach(b=>b.addEventListener("click",()=>loadQuestion(+b.dataset.i)));
  document.getElementById("checkAnswerBtn").addEventListener("click",doRun);
  document.getElementById("explainBtn").addEventListener("click",()=>runExplain("solution"));
  document.getElementById("explainWrongBtn").addEventListener("click",()=>runExplain("attempt"));
  initExplainModelSelect();
  initShellLayout();
  initTopicCollapse("collapsedTopicsTrading");
  initSidebarFilters();
  document.getElementById("solBtn").addEventListener("click",()=>document.getElementById("solution").classList.toggle("show"));
  document.getElementById("resetBtn").addEventListener("click",()=>{
    document.getElementById("writtenAnswer").value="";document.getElementById("writtenAnswer").focus();
  });
  document.getElementById("prevBtn").addEventListener("click",()=>goToQuestion(-1));
  document.getElementById("nextBtn").addEventListener("click",()=>goToQuestion(1));
  const lh=document.getElementById("lessonHead");
  lh.addEventListener("click",()=>{const l=document.getElementById("lesson");l.classList.toggle("collapsed");document.getElementById("chev").textContent=l.classList.contains("collapsed")?"show":"hide";});
  const ph=document.getElementById("promptHead");
  ph.addEventListener("click",()=>{const p=document.getElementById("promptBox");p.classList.toggle("collapsed");document.getElementById("promptChev").textContent=p.classList.contains("collapsed")?"show":"hide";});
  const wa=document.getElementById("writtenAnswer");
  wa.addEventListener("keydown",e=>{
    if((e.metaKey||e.ctrlKey)&&e.key==="Enter"){e.preventDefault();doRun();}
  });
  document.addEventListener("keydown",e=>{
    if(!e.shiftKey || document.activeElement===wa) return;
    if(e.key==="ArrowLeft"){e.preventDefault();goToQuestion(-1);}
    if(e.key==="ArrowRight"){e.preventDefault();goToQuestion(1);}
  });
  updateProgress();loadQuestion(startIndex);
})
.catch(err=>{document.getElementById("app").innerHTML='<div class="loading">Could not load the trainer. Check your connection and reload. ('+err.message+')</div>';});
