# em-dash-display  
**Visualizing the Rise of the Em Dash—Coincidence or Conspiracy?**  

🔗 [Live App](https://em-dash-display.up.railway.app/)

---

## About  
**em-dash-display** is a data exploration and visualization tool designed to dig deeper into the so-called *em-dash conspiracy*—a theory suggesting a recent surge in em dash (—) usage, possibly linked to AI-generated content.

This project visualizes data fetched by the [em-dash-conspiracy](https://github.com/v4nn4/em-dash-conspiracy) repository (created by Romain Florentz), offering a more interactive and thorough way to explore Reddit data retrieved via the platform’s API.

The goal is not only to analyze the data more deeply, but also to identify which specific subreddits exhibit higher em-dash usage than others—enabling a more granular view of potential trends and anomalies.


## Purpose

- Provide visual insights into em dash usage across time on Reddit.
- Help assess whether this trend is organic or artificially influenced.
- Make an extensive dataset accessible through an interactive web app.


## Files

- `app.py`: Flask server logic  
- `templates/index.html`: Main HTML page  
- `static/data/`: Structured data used for analysis and visualization  
- `static/js/`: JavaScript for rendering interactive visualizations  
- `static/styles/style.css`: CSS styles


## Data Notes  
"Data was generated on **May 4, 2025**, using Reddit’s API to fetch the top 1,000 posts from the past year in each subreddit.  
⚠️ *Note*: This introduces **time bias**—recent posts are underrepresented unless they quickly gained high scores. Treat this as **signal**, not **proof**." -Romain Florentz

---

# Blog

## **Investigating the Rise of the Em Dash—Coincidence or Conspiracy?**

Initially inspired by the elusive *em-dash conspiracy*, this project began as an attempt to rediscover a pattern of em-dash usage across platforms. While the original theory remains partly unconfirmed, *em-dash-display* visualizes recent Reddit data collected via API on May 4, 2025.


## Summary

With the release of **ChatGPT-4o**, em dash usage appears to have surged. But is this a stylistic evolution—or an artifact of AI-generated text? To find out, I examined public datasets from Reddit, Twitter, Facebook, Arxiv, Wikipedia, and Letterboxd.


## 🔍 Key Explorations

| Dataset                                                                      | Time Span | Observation                                                             |
| ---------------------------------------------------------------------------- | --------- | ----------------------------------------------------------------------- |
| [Twitter-Autism](https://www.kaggle.com/code/ottitsch/twitter-em)           | 2017–2023 | No notable em-dash pattern detected.                                    |
| [Arxiv & Wikipedia](https://www.kaggle.com/code/ottitsch/arxiv-wiki-em)     | 2007–2025 | No em dashes found (only first 98 characters of abstracts used).        |
| [Base-De-Reddit](https://www.kaggle.com/code/ottitsch/reddit-em)            | 2014–2025 | Significant increase in em-dash usage over recent years.                |
| [Letterboxd Movies](https://www.kaggle.com/code/ottitsch/letterbox-em)      | 1874–2031 | Recent movies more likely to use em dashes in descriptions.             |
| [Facebook Vietnam](https://www.kaggle.com/code/ottitsch/facebook-vietnam-em)| 2009–2020 | Able to simulate a false positive resembling ChatGPT-style text.        |

### Notable Case: Reddit AI Comments  
A [Reddit thread](https://www.reddit.com/r/changemyview/comments/1k8b2hj/meta_unauthorized_experiment_on_cmv_involving/) revealed that the **University of Zurich** ran an experiment using bots to post AI-generated comments on r/ChangeMyView. This real-world case supports the idea that AI-generated text—including stylistic markers like em dashes—is infiltrating online discourse.


## Constraints

- **Twitter**: API access is limited to 100 tweets, and scraping violates the TOS.  
  **→ Result**: Inconclusive. Tweet length and data volume were too restrictive to analyze reliably.


## Is the Em-Dash Conspiracy Real?

🧐 **Still unclear.**  
Reddit and movie datasets suggest a **spike** in em-dash use—perhaps from AI or bots.  
Twitter data is limited, and other platforms show **mixed results.**


Explore the data and draw your own conclusions:

🔗 [em-dash-display Web App](https://em-dash-display.up.railway.app/)  
📊 [Kaggle Notebooks](https://www.kaggle.com/code/ottitsch)

---

## 🚀 Setup Instructions

To run this project locally:

### 1. Clone the repository
```bash
git clone https://github.com/Ottitsch/em-dash-display.git
cd em-dash-display
```
### 2. Create and activate a virtual environment
```bash
python3 -m venv venv
source venv/bin/activate   # On Windows: venv\Scripts\activate
```
### 3. Install dependencies
```bash
pip install -r requirements.txt
```

### 4. Run the Flask app
```bash
python app.py
```
The app will be available at `http://127.0.0.1:5000/`.
