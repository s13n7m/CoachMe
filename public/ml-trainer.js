const TOPICS = ["ML workflow & problem framing", "Bias-variance tradeoff & regularization", "Classification evaluation metrics", "Tree-based models", "Linear & logistic regression", "Neural network fundamentals", "Feature engineering & imbalanced data", "Regression evaluation metrics", "Cross-validation & hyperparameter tuning", "Clustering & customer segmentation", "Causal inference & experimentation", "Model interpretability & common pitfalls", "Deployment, monitoring & drift", "End-to-end applied case study"];

const LESSONS = {"ML workflow & problem framing": {"subtopics": [{"name": "Supervised vs. unsupervised learning", "md": "\nIn **supervised learning**, you have labeled historical examples - you know the outcome for past cases and want to predict it for new ones. Predicting which customers will churn next month is supervised: you have past customers, and you know who actually churned.\n\nIn **unsupervised learning**, there's no label at all - you're looking for structure in the data itself. Grouping customers into behavioral segments with no predefined \"correct\" grouping is unsupervised.\n\n## Key terms\n- **Target variable** - the specific outcome a supervised model is trained to predict (e.g. \"made zero transactions in the next 60 days\"). Every supervised problem needs one, precisely defined; unsupervised problems don't have one at all.\n- **Label** - the known, historical value of the target variable for a given past example.\n- **Feature** - an input variable used to make the prediction (e.g. tenure, recent transaction count).\n- **Training example** - one row of data: features paired with a label (supervised) or just features (unsupervised).\n- **Classification** - a supervised task where the target variable is a category (e.g. churn/no churn).\n- **Regression** - a supervised task where the target variable is a number (e.g. next month's spend).\n- **Clustering** - an unsupervised task that groups similar examples together with no predefined groups.\n"}, {"name": "Framing the problem & avoiding data leakage", "md": "\nBefore touching any modeling code, five things need to happen in order:\n\n1. Define the business problem in plain English - what decision will this model actually inform?\n2. Frame it as a specific ML task: classification, regression, or clustering.\n3. Define the target variable precisely. \"Predict churn\" is not precise; \"predict whether a customer makes zero transactions in the next 60 days\" is.\n4. Gather and engineer features, thinking about what's actually available at prediction time.\n5. Split the data, train candidate models, validate, pick one, then deploy and monitor it in production.\n\nYou typically split your labeled data three ways: the **training set** (what the model learns from), the **validation set** (used repeatedly to compare models and tune hyperparameters), and the **test set** (touched exactly once, at the very end, for an honest read on real-world performance). If you use the test set to make even one modeling decision, it quietly becomes a second validation set and your final number stops being trustworthy.\n\n**Data leakage** happens when information that wouldn't actually be available at prediction time sneaks into training - most often a feature only known *after* the outcome happens. A model trained with a leaked feature looks great in testing and then falls apart in production, because that information simply isn't there yet when a real prediction needs to be made. A classic example: including \"number of support calls about a cancellation\" as a churn feature - that number is only known once the customer has essentially already churned.\n\n## Key terms\n- **Problem framing** - translating a vague business ask into a precise, well-posed ML task (a target variable, a population, a time window).\n- **Training / validation / test set** - the three-way split of labeled data: learn from training, tune against validation, get an honest final read from test (touched once).\n- **Data leakage** - a feature or signal in training data that wouldn't genuinely be available at the moment of a real prediction, making measured performance overly optimistic.\n", "note": "The most common mistake in an ML fundamentals discussion isn't picking the wrong algorithm - it's skipping straight to model choice before nailing down what the target variable actually is and whether the features you'd use are genuinely available at the moment you'd need to make the prediction. Naming the target variable precisely and checking for leakage earns more credit than jumping straight to \"I'd use XGBoost.\""}, {"name": "Choosing model complexity for the data you have", "md": "\nModel selection is part of the workflow too, and it's not just \"pick the fanciest option.\" Two things matter most: how much labeled data you have, and how important it is to explain a prediction to a stakeholder.\n\nNeural networks typically need far more data than a few thousand rows to learn reliably, and they're harder to explain to a non-technical stakeholder who will ask why the model flagged a given customer. Simpler models - logistic regression, gradient-boosted trees - often match or beat a neural network's accuracy on small-to-medium tabular datasets, while being faster to train, easier to debug, and easier to justify.\n\n## Key terms\n- **Baseline model** - a simple, quick-to-build model used as a first reference point before trying anything more complex.\n- **Interpretability** - how easily a human can understand why a model made a specific prediction.\n"}]}, "Bias-variance tradeoff & regularization": {"subtopics": [{"name": "Bias vs. variance", "md": "\n**Bias** is error from a model that's too simple to capture the real pattern - it makes strong, often wrong, assumptions and underfits. **Variance** is error from a model that's too sensitive to the specific training data it happened to see - it fits the noise, not just the signal, and overfits.\n\nA straight line forced through clearly curved data has high bias. A wiggly curve that passes through every single training point but swings wildly on new data has high variance.\n\nAs you increase model complexity (more features, deeper trees, more parameters), bias tends to fall and variance tends to rise. Total error is roughly U-shaped across that complexity spectrum - too simple and too complex both hurt you, and the best model sits somewhere in the middle.\n\n## Key terms\n- **Bias** - error from overly simplistic assumptions; shows up as poor performance on training data itself.\n- **Variance** - error from excess sensitivity to the training sample; shows up as a large gap between training and validation performance.\n- **Underfitting** - a model too simple to capture the real pattern (high bias).\n- **Overfitting** - a model that has learned the training data's noise, not just its signal (high variance).\n", "video": {"id": "Unol0NZtuRo", "title": "Bias-Variance Trade-Off, Clearly Explained"}}, {"name": "Diagnosing bias vs. variance", "md": "\nThe fastest way to tell which problem you have is to compare training performance to validation performance:\n\n- Training and validation both poor -> high **bias** (underfitting).\n- Training excellent, validation much worse -> high **variance** (overfitting).\n- Training and validation both good and close together -> a reasonable spot.\n\nThis diagnostic matters because the fix runs in opposite directions depending on which one you have - there's no single universal fix that helps both.\n\n## Key terms\n- **Generalization** - how well a model's performance on training data carries over to new, unseen data.\n"}, {"name": "Regularization: Ridge & Lasso", "md": "\n**Regularization** adds a penalty for large coefficients directly into what the model is trying to minimize, discouraging it from leaning too hard on any one feature. It's the main lever for reducing variance.\n\n- **Ridge (L2)** shrinks all coefficients toward zero, but rarely all the way to exactly zero.\n- **Lasso (L1)** can shrink some coefficients to *exactly* zero, effectively removing those features - useful when you suspect only a handful of your features actually matter.\n\nIf a model is high-variance, increasing regularization strength (or simplifying the model) helps. If a model is high-bias, the fix runs the other way: reduce regularization strength, add more informative features, or move to a more flexible model class entirely.\n\n## Key terms\n- **Regularization** - a penalty added to a model's training objective that discourages overly large coefficients, trading a little bias for less variance.\n- **Ridge regression (L2)** - regularization that shrinks all coefficients toward zero without eliminating any entirely.\n- **Lasso regression (L1)** - regularization that can shrink some coefficients to exactly zero, a form of automatic feature selection.\n- **Hyperparameter** - a setting chosen before training (like regularization strength) rather than learned from the data itself.\n", "note": "\"Just collect more data\" is a classic interview trap. More training data reliably helps a high-variance problem (the model has less room to memorize noise), but it does essentially nothing for a high-bias problem - if your model is fundamentally too simple for the pattern, feeding it more of the same simple assumptions just gets you a more confidently wrong model, not a better one."}]}, "Classification evaluation metrics": {"subtopics": [{"name": "Confusion matrix, precision & recall", "md": "\nEvery binary classifier's predictions at a given threshold fall into four buckets, defined against the actual outcome:\n\n- **True Positive (TP)**: predicted positive, actually positive.\n- **False Positive (FP)**: predicted positive, actually negative - a false alarm.\n- **False Negative (FN)**: predicted negative, actually positive - a miss.\n- **True Negative (TN)**: predicted negative, actually negative.\n\nTake a model predicting which customers will make a repeat payment: a customer flagged as likely-to-repeat who actually does is a TP; one flagged as likely-to-repeat who never does is a FP.\n\n**Precision** = TP / (TP + FP) - of everyone you flagged as positive, what fraction actually were? **Recall** = TP / (TP + FN) - of everyone who actually was positive, what fraction did you catch? These trade off against each other, and which one matters more is a business question: if a false positive is cheap, prioritize recall; if it's expensive, prioritize precision. **F1 score** is the harmonic mean of the two, useful when you want one number balancing both.\n\n## Key terms\n- **Confusion matrix** - the TP/FP/FN/TN breakdown of a classifier's predictions at a given threshold.\n- **Precision** - TP / (TP + FP); how trustworthy a positive prediction is.\n- **Recall** - TP / (TP + FN); how completely the model catches real positives.\n- **F1 score** - the harmonic mean of precision and recall.\n", "note": "Accuracy alone is a misleading metric on imbalanced data. If only 5% of customers actually churn, a model that predicts \"never churns\" for everyone is 95% accurate and completely useless. This is exactly why precision, recall, and F1 exist - always ask about the class balance before trusting an accuracy number."}, {"name": "Computing metrics from real predictions", "md": "\nTo turn a model's predicted probability into a classification, pick a **threshold**: everything scored at or above it is predicted positive, everything below is predicted negative. A threshold of 0.5 is the common default, but it's just a choice - shifting it trades precision for recall in either direction.\n\nOnce you have predicted labels at a chosen threshold, computing TP/FP/FN/TN is direct boolean-mask arithmetic against the actual outcome column, and precision/recall/F1 follow immediately from those four counts.\n\n## Key terms\n- **Threshold** - the cutoff on a predicted probability above which a prediction is called \"positive.\"\n"}, {"name": "AUC & the rank-sum method", "md": "\nEvery metric so far depends on the threshold you chose - a different cutoff gives a different confusion matrix. **AUC** (Area Under the ROC Curve) sidesteps that: it's the probability that a randomly chosen positive example gets a higher score than a randomly chosen negative one, across *all* thresholds at once. AUC of 0.5 means the model is no better than random guessing; 1.0 means perfect separation; real production models often land around 0.75-0.90.\n\nAUC can be computed directly from ranks, without ever touching sklearn: rank every prediction score from lowest to highest (ties get the average rank), then\n\n`AUC = (sum of ranks belonging to positive examples - n_pos * (n_pos + 1) / 2) / (n_pos * n_neg)`\n\nThis works because the sum of ranks of the positive class, adjusted by the smallest-possible sum a positive class of that size could have, counts exactly how many positive/negative pairs are correctly ordered - which is precisely what AUC measures. `scipy.stats.rankdata` computes the ranks (average rank for ties) needed for this formula.\n\n## Key terms\n- **AUC (Area Under the Curve)** - the probability a random positive example outscores a random negative one; a threshold-independent summary of separability.\n- **Rank** - an example's position when all predicted scores are sorted from lowest to highest; ties share the average rank.\n", "video": {"id": "4jRBRDbJemM", "title": "ROC and AUC, Clearly Explained"}}]}, "Tree-based models": {"subtopics": [{"name": "Decision trees", "md": "\nA decision tree asks a series of yes/no questions about your features, splitting the data at each step to make the resulting groups as \"pure\" as possible (mostly one class, or a tight range of values).\n\nThey're easy to explain to a non-technical stakeholder - you can literally draw the tree and walk someone through the logic - but a single deep tree tends to overfit badly (high variance): left unconstrained, it keeps splitting until each leaf is tailored to a tiny handful of specific training rows, memorizing quirks rather than general patterns.\n\n## Key terms\n- **Decision tree** - a model that makes predictions via a sequence of feature-based yes/no splits.\n- **Purity** - how homogeneous the data in a node is after a split; trees choose splits that increase purity the most.\n", "video": {"id": "_L39rN6gz7Y", "title": "Decision and Classification Trees, Clearly Explained"}}, {"name": "Random forests & bagging", "md": "\nA random forest trains many decision trees, each on a random subset of the rows and a random subset of the features, then averages their predictions (or takes a majority vote for classification).\n\nThis is called **bagging** (bootstrap aggregating): individual trees still overfit their own random slice of the data, but their errors are different from each other and tend to cancel out when averaged, which is what makes the forest far less variance-prone than any single tree.\n\n## Key terms\n- **Random forest** - an ensemble of many decision trees, each trained on a random subset of rows and features, combined by averaging or voting.\n- **Bagging** - training many models independently on random subsets of data and combining their predictions to cancel out individual overfitting.\n", "video": {"id": "J4Wdy0Wc_xQ", "title": "StatQuest: Random Forests Part 1"}}, {"name": "Gradient boosting", "md": "\nGradient boosting (the family behind XGBoost, LightGBM) also combines many trees, but builds them *sequentially* rather than independently - each new tree is trained specifically to correct the errors the previous trees made.\n\nFor structured, tabular business data specifically, gradient-boosted ensembles are usually the strongest off-the-shelf choice, often edging out random forests on raw accuracy. That said, it's more sensitive to hyperparameters - learning rate, tree depth, number of boosting rounds - and if those aren't tuned carefully it can overfit more easily than a random forest. It's also slower to train, since each tree in the sequence depends on the errors of the ones before it and can't be built in parallel the way a forest's independent trees can.\n\n## Key terms\n- **Gradient boosting** - an ensemble that builds trees sequentially, each one correcting the errors of the trees before it.\n- **Learning rate** - how much each new tree's correction is allowed to influence the overall prediction.\n"}]}};

const QUESTIONS = [{"topic": "ML workflow & problem framing", "subtopic": "Supervised vs. unsupervised learning", "diff": "easy", "type": "mc", "ask": "Which of these is a supervised learning problem?", "hint": "Supervised means you have a labeled outcome for past examples.", "bonus": false, "options": ["Grouping customers into behavioral segments with no predefined groups", "Predicting which customers will churn next month, using past customers where you know who actually churned", "Finding which transactions look unusual compared to the rest, with no examples of confirmed fraud", "Reducing a large set of correlated features down to a handful of components"], "correctIndex": 1, "explanation": "Churn prediction has a known label for past customers (did they churn or not) - that's exactly what makes it supervised. The others are all unsupervised: no predefined groups, no confirmed fraud labels, and no target variable at all.", "id": 0}, {"topic": "ML workflow & problem framing", "subtopic": "Framing the problem & avoiding data leakage", "diff": "medium", "type": "written", "ask": "Product asks you to help reduce customer churn. Walk through, in plain terms, how you'd frame this as a supervised learning problem - what's the target variable, what would a training example look like, and what's the very first thing you'd check before building anything?", "hint": "Define the target variable precisely before anything else, then think about what data leakage would look like here.", "bonus": false, "modelAnswer": "The target variable needs a precise, unambiguous definition - not \"will churn\" but something like \"makes zero transactions in the 60 days following a given reference date,\" with the reference date and window explicitly agreed with the business. A training example would be one row per customer as of some past reference date, with their features as of that date (tenure, recent activity, product usage, support tickets) and the label of whether they actually met the churn definition in the window that followed. Before building anything, the first thing to check is whether every feature you'd want to use was genuinely available and known AT that reference date - not information that only became known later, which would leak future information into the model and make it look far better in testing than it will ever perform in production.", "id": 1}, {"topic": "ML workflow & problem framing", "subtopic": "Choosing model complexity for the data you have", "diff": "hard", "type": "written", "ask": "Your manager suggests jumping straight to a neural network for a churn model with 3,000 labeled examples and 12 features. How would you respond, and why?", "hint": "Think about data size, interpretability, and what actually tends to win on small tabular datasets.", "bonus": false, "modelAnswer": "I'd push back, respectfully, and start with a simpler model first - logistic regression or a gradient-boosted tree - before reaching for a neural network. Neural networks typically need far more data than 3,000 rows to learn reliably; with only 12 features and a few thousand examples, a simpler model will very likely match or beat a neural network's accuracy while being dramatically faster to train, easier to debug, and easier to explain to stakeholders who will ask why the model flagged a given customer. I'd frame it as: let's establish a strong, interpretable baseline first, measure it properly on a held-out set, and only reach for something more complex like a neural network if there's a clear, measured gap the simpler model isn't closing - which, at this data size, would be a genuine surprise.", "id": 2}, {"topic": "Bias-variance tradeoff & regularization", "subtopic": "Diagnosing bias vs. variance", "diff": "easy", "type": "mc", "ask": "A model has 98% accuracy on training data and 61% accuracy on validation data. This is a sign of:", "hint": "Big gap between training and validation performance points to one specific failure mode.", "bonus": false, "options": ["High bias (underfitting)", "High variance (overfitting)", "A well-calibrated model", "Data leakage in the validation set"], "correctIndex": 1, "explanation": "A large gap between excellent training performance and much worse validation performance is the textbook signature of high variance / overfitting - the model has essentially memorized the training data rather than learning a pattern that generalizes.", "id": 3}, {"topic": "Bias-variance tradeoff & regularization", "subtopic": "Bias vs. variance", "diff": "medium", "type": "written", "ask": "Explain the bias-variance tradeoff to a product manager who has never heard the term, using a concrete example from customer churn prediction.", "hint": "Use a plain-language analogy rather than the formal definitions.", "bonus": false, "modelAnswer": "Imagine two ways of predicting churn: a very simple rule like \"anyone who hasn't logged in for 30 days will churn,\" versus a very complicated model that has essentially memorized the exact history of every customer in our training data. The simple rule is too rigid - it ignores lots of relevant detail, so it makes the same kinds of mistakes over and over. That's high bias. The overly complicated model fits our specific past customers extremely well, but it's so tuned to their exact quirks that it falls apart on new customers it hasn't seen before. That's high variance. The goal is something in between: a model flexible enough to capture the real patterns in customer behavior, but not so flexible that it starts fitting random noise specific to the customers we happened to train on.", "id": 4}, {"topic": "Bias-variance tradeoff & regularization", "subtopic": "Regularization: Ridge & Lasso", "diff": "hard", "type": "written", "ask": "You're told a churn model has both low training accuracy AND low validation accuracy. Is this a bias or variance problem, and what would you actually try to fix it? Then, a colleague suggests 'just collect more training data' - would that help here? Why or why not?", "hint": "Both being bad (not just validation) points to a specific one of the two problems - and to a specific direction to move regularization in.", "bonus": false, "modelAnswer": "Both training and validation performance being poor together is the signature of high bias, not high variance - the model is too simple or missing the right signal to fit even the data it's trained on, let alone new data. To actually fix it, I'd add more informative features, consider a more flexible model class (a gradient-boosted tree instead of plain logistic regression, for instance), or reduce regularization strength if it's currently too aggressive. Collecting more training data would not meaningfully help here - more data helps a model that's overfitting noise in a small sample (a variance problem), but if the model is fundamentally too simple or missing the right features to capture the pattern, more rows of the same limited information just gives it more data to be equally wrong about.", "id": 5}, {"topic": "Classification evaluation metrics", "subtopic": "Confusion matrix, precision & recall", "diff": "easy", "type": "written", "ask": "Using the confusion matrix terms TP/FP/FN/TN, explain in your own words the difference between precision and recall.", "hint": "Precision is about the positives you predicted; recall is about the positives that actually existed.", "bonus": false, "modelAnswer": "Precision asks: of everyone I predicted as positive, what fraction actually were positive? It's TP divided by (TP + FP), and it's about how much you trust a positive prediction. Recall asks a different question: of everyone who was actually positive, what fraction did I successfully catch? It's TP divided by (TP + FN), and it's about how complete your coverage of the real positives is. A model can have high precision but low recall (very confident, but misses a lot of real cases), or the reverse (catches almost everything, but with a lot of false alarms) - which one matters more depends entirely on the cost of a false positive versus a false negative in the specific business context.", "id": 6}, {"topic": "Classification evaluation metrics", "subtopic": "Computing metrics from real predictions", "diff": "medium", "type": "pycalc", "ask": "Using the `predictions` DataFrame (repeat_payment is the actual outcome, pred_score is the model's predicted probability), compute the confusion matrix and precision/recall/F1 at a 0.5 threshold. Return one dict with all seven values.", "hint": "Turn pred_score into a 0/1 label at the 0.5 cutoff first, then compare against repeat_payment with boolean masks to get TP/FP/FN/TN, and derive precision/recall/F1 from those.", "bonus": false, "prompt": "Return result as a dict: {'TP':int, 'FP':int, 'FN':int, 'TN':int, 'precision':float, 'recall':float, 'f1':float}, the floats rounded to 3 decimals.", "ordered": false, "solution": "pred_label = (predictions['pred_score'] >= 0.5).astype(int)\ntp = int(((pred_label==1) & (predictions['repeat_payment']==1)).sum())\nfp = int(((pred_label==1) & (predictions['repeat_payment']==0)).sum())\nfn = int(((pred_label==0) & (predictions['repeat_payment']==1)).sum())\ntn = int(((pred_label==0) & (predictions['repeat_payment']==0)).sum())\nprecision = round(tp/(tp+fp), 3)\nrecall = round(tp/(tp+fn), 3)\nf1 = round(2*precision*recall/(precision+recall), 3)\nresult = {'TP': tp, 'FP': fp, 'FN': fn, 'TN': tn, 'precision': float(precision), 'recall': float(recall), 'f1': float(f1)}", "id": 7}, {"topic": "Classification evaluation metrics", "subtopic": "AUC & the rank-sum method", "diff": "hard", "type": "pycalc", "ask": "Compute the model's AUC using the rank-sum method taught in the lesson - no sklearn, just pandas/numpy/scipy. Round to 3 decimals.", "hint": "Rank every score with scipy.stats.rankdata, sum the ranks belonging to the positive class, then apply the rank-sum AUC formula from the lesson.", "bonus": false, "prompt": "Return result as a float rounded to 3 decimals.", "ordered": false, "solution": "from scipy.stats import rankdata\nranks = rankdata(predictions['pred_score'])\nn_pos = int((predictions['repeat_payment']==1).sum())\nn_neg = int((predictions['repeat_payment']==0).sum())\nrank_sum_pos = ranks[predictions['repeat_payment']==1].sum()\nauc = (rank_sum_pos - n_pos*(n_pos+1)/2) / (n_pos*n_neg)\nresult = round(float(auc), 3)", "id": 8}, {"topic": "Tree-based models", "subtopic": "Decision trees", "diff": "easy", "type": "mc", "ask": "Why does a single, unconstrained decision tree tend to overfit the training data?", "hint": "Think about how deep a tree is allowed to grow and what that lets it do to individual training rows.", "bonus": false, "options": ["It can keep splitting until each leaf is tailored to a tiny handful of specific training rows, memorizing quirks rather than general patterns", "It has too few parameters to capture any real pattern", "It always ignores the majority of the available features", "It can only make one split, so it never learns enough"], "correctIndex": 0, "explanation": "Left unconstrained, a decision tree keeps splitting the data to maximize purity in each resulting group, which lets it grow arbitrarily deep - carving out an ever-more-specific rule for smaller and smaller groups of training rows until it's essentially memorizing noise rather than a generalizable pattern.", "id": 9}, {"topic": "Tree-based models", "subtopic": "Random forests & bagging", "diff": "medium", "type": "mc", "ask": "What's the main reason a random forest tends to generalize better than a single deep decision tree?", "hint": "Think about what averaging many trees, each trained on a random slice, does to their errors.", "bonus": false, "options": ["It uses a completely different splitting rule than a single tree", "Averaging many trees, each trained on a random subset of rows and features, cancels out the individual trees' overfitting", "It always uses fewer features than a single tree, which prevents overfitting by design", "Random forests don't actually use decision trees internally"], "correctIndex": 1, "explanation": "Bagging is the key idea: each individual tree still overfits its own random slice of the data, but since those errors aren't correlated across trees, averaging (or majority-voting) their predictions cancels much of that noise out - which is what makes the forest more stable than any single tree.", "id": 10}, {"topic": "Tree-based models", "subtopic": "Gradient boosting", "diff": "hard", "type": "written", "ask": "A colleague proposes gradient boosting over random forest for a new fraud-detection model, citing better accuracy. What tradeoff should you flag before agreeing?", "hint": "Think about tuning sensitivity, training speed, and overfitting risk between the two.", "bonus": false, "modelAnswer": "Gradient boosting often does edge out random forest on tabular data like this, but it comes with real tradeoffs worth flagging before committing to it. It's more sensitive to hyperparameters - learning rate, tree depth, number of boosting rounds - and if those aren't tuned carefully with proper cross-validation, it can overfit more easily than a random forest, which is fairly robust even with default settings. It's also slower to train, since each tree in the sequence depends on the errors of the ones before it and can't be built in parallel the way a random forest's independent trees can - worth considering if this model needs to be retrained frequently as fraud patterns shift. I'd suggest building both, tuning each properly, and comparing on a proper held-out set before deciding, rather than assuming gradient boosting's typical edge holds for this specific dataset.", "id": 11}];


let current=0;
const solved=new Set();
const flagged=new Set();
const savedAnswers={};

function topicIndices(topic){const out=[];QUESTIONS.forEach((q,i)=>{if(q.topic===topic)out.push(i);});return out;}
function topicRequiredIndices(topic){return topicIndices(topic).filter(i=>!QUESTIONS[i].bonus);}
function topicDone(topic){return topicRequiredIndices(topic).filter(i=>solved.has(QUESTIONS[i].id)).length;}
function requiredCount(){return QUESTIONS.filter(q=>!q.bonus).length;}
function requiredSolvedCount(){let n=0;QUESTIONS.forEach(q=>{if(!q.bonus&&solved.has(q.id))n++;});return n;}

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
      html+='<button class="qbtn'+(solved.has(QUESTIONS[i].id)?" done":"")+(QUESTIONS[i].bonus?" bonus":"")+'" data-i="'+i+'"><span class="dot">'+(solved.has(QUESTIONS[i].id)?"✓":"")+'</span><span class="star">'+(flagged.has(QUESTIONS[i].id)?"★":"")+'</span><span class="lbl">'+(QUESTIONS[i].ask.slice(0,40))+(QUESTIONS[i].ask.length>40?"...":"")+'</span></button>';
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
      +'<div class="editor-bar" id="pycalcBar"><span id="editorLabel">answer.py</span><button class="schema-toggle" id="schemaBtn">view data</button></div>'
      +'<textarea id="sql" spellcheck="false" autocapitalize="off" autocomplete="off"></textarea>'
      +'<textarea id="writtenAnswer" style="display:none" spellcheck="true" placeholder="Type your answer here - a few sentences covering the key ideas is plenty. Talk through it the way you would out loud in the interview."></textarea>'
      +'<div id="mcOptions" class="mc-options" style="display:none"></div>'
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
    +'<div class="solution" id="solution"><div class="lbl" id="solutionLbl">One correct solution (there are often several)</div><pre id="solText" style="display:none"></pre><div id="solProse" style="display:none"></div></div>'
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
  document.getElementById("progBar").style.width=Math.round(done/total*100)+"%";
  updateQuizGate(done,total);
}
function updateQuizGate(done,total){
  const btn=document.getElementById("quizBtn");
  if(!btn) return;
  if(done>=total){btn.classList.remove("locked");btn.removeAttribute("aria-disabled");}
  else{btn.classList.add("locked");btn.setAttribute("aria-disabled","true");}
}

function setAnswerAreaForType(type){
  document.getElementById("pycalcBar").style.display=type==="pycalc"?"flex":"none";
  document.getElementById("sql").style.display=type==="pycalc"?"block":"none";
  document.getElementById("writtenAnswer").style.display=type==="written"?"block":"none";
  document.getElementById("mcOptions").style.display=type==="mc"?"block":"none";
  document.getElementById("runBtn").style.display=type==="pycalc"?"":"none";
  document.getElementById("checkAnswerBtn").style.display=type==="written"?"":"none";
  document.getElementById("solBtn").style.display=type==="mc"?"none":"";
  document.getElementById("schemaBtn").style.display=type==="pycalc"?"":"none";
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
  document.getElementById("lessonTitle").textContent=q.subtopic||"Lesson";
  document.getElementById("lessonBody").innerHTML=renderLesson(q.topic, q.subtopic);
  document.getElementById("askText").textContent=q.ask;
  document.getElementById("promptBox").classList.add("collapsed");
  document.getElementById("promptChev").textContent="show";
  document.getElementById("hint").innerHTML="<b>Hint:</b> "+q.hint;
  setAnswerAreaForType(q.type);
  document.getElementById("verdict").className="verdict";
  document.getElementById("stdoutBox").style.display="none";
  document.getElementById("varsBox").style.display="none";
  document.getElementById("resultsBox").style.display="none";
  document.getElementById("solution").className="solution";
  document.getElementById("explainBox").style.display="none";
  setExplainWrongVisible(false);
  const solLbl=document.getElementById("solutionLbl"),solText=document.getElementById("solText"),solProse=document.getElementById("solProse");
  if(q.type==="pycalc"){
    solLbl.textContent="One correct solution (there are often several)";
    solText.style.display="block";solText.textContent=q.solution;
    solProse.style.display="none";
    document.getElementById("sql").value=savedAnswers[q.id]||"";
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
  if(q.type==="pycalc") document.getElementById("sql").focus({preventScroll:true});
  else if(q.type==="written") document.getElementById("writtenAnswer").focus({preventScroll:true});
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
    const payload={track:"ml",mode:"trainer",questionId:q.id,kind:"grade",ask:q.ask,solution:q.modelAnswer,studentAnswer:answer,model:getExplainModel()};
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

function doRun(){
  const q=QUESTIONS[current];
  if(q.type==="pycalc") return doRunPycalc();
  if(q.type==="written") return doCheckWritten();
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
  return supabaseClient.from("attempts").select("question_id,passed,query_text,created_at").eq("mode","trainer").eq("track","ml").order("created_at",{ascending:true})
    .then(({data,error})=>{
      if(error||!data) return;
      data.forEach(r=>{
        if(r.passed){solved.add(r.question_id);savedAnswers[r.question_id]=r.query_text;}
      });
      if(data.length) startIndex=data[data.length-1].question_id;
    });
}

function hydrateFlags(){
  return fetchFlaggedIds("ml","trainer").then(ids=>ids.forEach(id=>flagged.add(id)));
}

function toggleFlag(id){
  const on=!flagged.has(id);
  if(on) flagged.add(id); else flagged.delete(id);
  setQuestionFlag("ml","trainer",id,on);
  renderStar(id);
  const btn=document.querySelector('.qbtn[data-i="'+current+'"]');
  if(btn){
    const st=btn.querySelector(".star");
    if(st) st.textContent=on?"★":"";
  }
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
      (q.type==="written" ? q.modelAnswer : q.solution);
    const payload={track:"ml",mode:"trainer",questionId:q.id,kind,ask:q.ask,prompt:"",solution:refSolution,model:getExplainModel()};
    if(kind==="attempt"){
      payload.userCode=q.type==="pycalc" ? document.getElementById("sql").value : (savedAnswers[q.id]||"");
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
  supabaseClient.from("attempts").insert({question_id:questionId,query_text:answerText,passed,mode:"trainer",track:"ml"}).then(()=>{});
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

Promise.all([
  initPyodideEnv(),
  requireAuth().then(()=>Promise.all([hydrateProgress(),hydrateFlags()]))
])
.then(()=>{
  const app=document.getElementById("app");app.className="";
  app.innerHTML='<div class="wrap"><aside id="sidebar">'+buildSidebar()+'</aside>'+buildMain()+'<div class="col-resizer" id="colResizer"></div><div class="right-col" id="rightCol"></div></div>';
  document.getElementById("schema").innerHTML=buildPySchema();
  document.getElementById("totalCount").textContent=requiredCount();
  document.querySelectorAll(".qbtn").forEach(b=>b.addEventListener("click",()=>loadQuestion(+b.dataset.i)));
  document.getElementById("runBtn").addEventListener("click",doRun);
  document.getElementById("checkAnswerBtn").addEventListener("click",doRun);
  document.getElementById("explainBtn").addEventListener("click",()=>runExplain("solution"));
  document.getElementById("explainWrongBtn").addEventListener("click",()=>runExplain("attempt"));
  initExplainModelSelect();
  initShellLayout();
  initTopicCollapse("collapsedTopicsMl");
  document.getElementById("solBtn").addEventListener("click",()=>document.getElementById("solution").classList.toggle("show"));
  document.getElementById("resetBtn").addEventListener("click",()=>{
    const q=QUESTIONS[current];
    if(q.type==="pycalc"){document.getElementById("sql").value="";document.getElementById("sql").focus();}
    else if(q.type==="written"){document.getElementById("writtenAnswer").value="";document.getElementById("writtenAnswer").focus();}
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
    if(e.key==="Tab"){e.preventDefault();const s=ta.selectionStart,en=ta.selectionEnd;ta.value=ta.value.slice(0,s)+"    "+ta.value.slice(en);ta.selectionStart=ta.selectionEnd=s+4;}
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
});
