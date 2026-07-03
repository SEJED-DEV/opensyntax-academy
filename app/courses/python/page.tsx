import type { Metadata } from "next"
import { Navbar } from "@/components/navbar"
import { LessonPlayer, type Module } from "@/components/lesson-player"

export const metadata: Metadata = {
  title: "Python & Data Science — NumPy, Pandas, Scikit-learn & ML Deployment",
  description: "Build a complete data science toolkit. From Python core syntax to NumPy vectorization, Pandas data manipulation, interactive visualizations with Plotly and Streamlit, production ML pipelines, and model deployment with FastAPI and Docker.",
  keywords: ["Python Course", "Data Science Tutorial", "NumPy", "Pandas", "Scikit-learn", "Machine Learning Python", "Plotly", "Streamlit", "FastAPI", "MLflow"],
}

const pythonModules: Module[] = [
  {
    id: "python-tier-1", title: "Tier 1: Foundations — Python Core & Environment",
    lessons: [
      {
        id: "syntax-venv", title: "Syntax, Data Structures & Venv", duration: "35 min",
        description: "Mastering the Pythonic way. Lists, Dictionaries, List Comprehensions, and managing dependencies with Virtual Environments.",
        content: `<h2>The Pythonic Path</h2>
<p>Python's strength is its readability. We focus on <strong>List Comprehensions</strong> and <strong>Generators</strong> to write concise, memory-efficient code.</p>
<pre><code class="language-python"># List comprehension vs traditional loop
numbers = [1, 2, 3, 4, 5]
squares = [n ** 2 for n in numbers if n % 2 == 0]
print(squares)  # [4, 16]</code></pre>
<h3>Dependency Isolation</h3>
<p>Never install packages globally. We use <code>venv</code> or <code>conda</code> to create isolated environments, ensuring that project dependencies don't conflict across your system.</p>`,
        quiz: [
          { question: "What is the primary advantage of using a virtual environment in Python?", options: ["Faster code execution", "Isolating project dependencies to avoid version conflicts", "Automatic code formatting", "Built-in database support"], correctIndex: 1, explanation: "Virtual environments create isolated Python environments, preventing dependency version conflicts between different projects." }
        ]
      },
      {
        id: "functions-modules", title: "Functions, Lambdas & Modules", duration: "30 min",
        description: "Master Python functions, lambda expressions, and how to organize code into reusable modules and packages.",
        content: `<h2>Functions Are First-Class</h2>
<p>In Python, functions can be assigned to variables, passed as arguments, and returned from other functions. This enables powerful patterns like decorators and callbacks.</p>
<pre><code class="language-python">def make_multiplier(factor: int):
    return lambda x: x * factor

double = make_multiplier(2)
triple = make_multiplier(3)

print(double(5))  # 10
print(triple(5))  # 15</code></pre>
<h3>Module Organization</h3>
<p>A module is a <code>.py</code> file, and a package is a directory with an <code>__init__.py</code>. Use relative imports within packages to keep your codebase maintainable.</p>`
      },
      {
        id: "file-io-logging", title: "File I/O, Error Handling & Logging", duration: "25 min",
        description: "Production-grade file operations, exception handling with try/except/finally, and structured logging.",
        content: `<h2>Context Managers</h2>
<p>Use the <code>with</code> statement to ensure resources are properly cleaned up. Context managers eliminate common bugs like forgetting to close file handles.</p>
<pre><code class="language-python">import json

with open("config.json", "r") as f:
    config = json.load(f)

try:
    result = risky_operation(config)
except ValueError as e:
    print(f"Validation failed: {e}")
except Exception as e:
    print(f"Unexpected error: {e}")
finally:
    cleanup()</code></pre>
<h3>Structured Logging</h3>
<p>Use Python's <code>logging</code> module instead of print statements. The standard pattern creates a module-level logger and configures handlers for different output targets.</p>`
      }
    ]
  },
  {
    id: "python-tier-2", title: "Tier 2: Intermediate — Data Manipulation (NumPy/Pandas)",
    lessons: [
      {
        id: "numpy-pandas", title: "Vectorization with NumPy & Pandas DataFrames", duration: "50 min",
        description: "Ditch Python loops. Using NumPy broadcasting and Pandas grouping for high-performance data analysis.",
        content: `<h2>Vectorized Computation</h2>
<p>Python loops are slow. <strong>NumPy</strong> allows us to perform operations on entire arrays at C-speed using vectorization and broadcasting.</p>
<h3>Pandas: The Data Engine</h3>
<p>We use <strong>Pandas</strong> to clean, transform, and analyze tabular data. Mastering <code>groupby</code>, <code>merge</code>, and <code>pivot_table</code> allows you to extract insights from millions of rows in seconds.</p>`
      },
      {
        id: "data-cleaning", title: "Data Cleaning & Missing Value Handling", duration: "40 min",
        description: "Real-world data is messy. Build robust pipelines for handling missing values, outliers, and inconsistent formats.",
        content: `<h2>Handling Missing Data</h2>
<p>Pandas provides <code>isna()</code>, <code>dropna()</code>, and <code>fillna()</code> for dealing with null values. The strategy depends on your data: drop rows with few missing values, impute for critical features.</p>
<pre><code class="language-python">import pandas as pd
import numpy as np

df = pd.read_csv("sales.csv")

# Forward-fill time series gaps
df["revenue"] = df["revenue"].ffill()

# Impute numeric columns with median
for col in ["age", "salary"]:
    df[col] = df[col].fillna(df[col].median())</code></pre>
<h3>Outlier Detection</h3>
<p>Use IQR (Interquartile Range) or Z-scores to identify outliers. Removing or capping outliers improves model robustness significantly.</p>`,
        quiz: [
          { question: "Which Pandas method is most appropriate for filling missing values in a time series where values follow a trend?", options: ["fillna(method='ffill')", "fillna(df.mean())", "dropna()", "interpolate()"], correctIndex: 0, explanation: "Forward fill (ffill) propagates the last valid observation forward, preserving the trend in time series data." }
        ]
      },
      {
        id: "time-series-analysis", title: "Time Series Analysis with Pandas", duration: "45 min",
        description: "Analyze temporal data using resampling, rolling windows, and datetime indexing for financial and sensor data.",
        content: `<h2>DateTimeIndex Power</h2>
<p>Converting date columns to a <code>DatetimeIndex</code> unlocks time-based slicing, resampling, and shifting operations essential for time series analysis.</p>
<pre><code class="language-python">import pandas as pd

df = pd.read_csv("stock_prices.csv", parse_dates=["date"])
df = df.set_index("date")

# Resample to monthly averages
monthly = df["close"].resample("M").mean()

# 30-day rolling volatility
df["volatility"] = df["close"].pct_change().rolling(30).std()</code></pre>
<h3>Seasonality & Trends</h3>
<p>Decompose your time series into trend, seasonal, and residual components using <code>statsmodels</code>. This helps identify repeating patterns and long-term direction.</p>`
      }
    ]
  },
  {
    id: "python-tier-3", title: "Tier 3: Production — Machine Learning & Big Data",
    lessons: [
      {
        id: "sklearn-dask", title: "Scikit-learn Pipelines & Dask Scaling", duration: "65 min",
        description: "Building production ML models. Pipeline engineering with Scikit-learn and scaling to big data with Dask.",
        content: `<h2>Production ML Pipelines</h2>
<p>To avoid data leakage, we wrap our preprocessing and model training into <strong>Scikit-learn Pipelines</strong>. This ensures that scaling and imputation are always consistent between training and inference.</p>
<h3>Scaling with Dask</h3>
<p>When data exceeds your RAM, we use <strong>Dask</strong>. It parallelizes NumPy and Pandas operations across all CPU cores or even multiple machines, allowing you to process Terabytes of data.</p>
<p><strong>Pro Tip:</strong> Integrate <strong>Local SLM Agents</strong> (Small Language Models) into your data pipelines for semantic classification and anomaly detection without relying on external cloud APIs.</p>`
      },
      {
        id: "feature-engineering", title: "Feature Engineering & Selection", duration: "50 min",
        description: "Build production-grade feature extraction pipelines and select the most predictive variables for your models.",
        content: `<h2>Feature Engineering</h2>
<p>The quality of your features determines the ceiling of your model's performance. We explore polynomial features, binning, one-hot encoding, and domain-specific aggregations.</p>
<pre><code class="language-python">from sklearn.preprocessing import PolynomialFeatures, StandardScaler
from sklearn.feature_selection import SelectKBest, f_regression

# Create interaction terms
poly = PolynomialFeatures(degree=2, interaction_only=True)
X_interact = poly.fit_transform(X)

# Select top features
selector = SelectKBest(score_func=f_regression, k=10)
X_selected = selector.fit_transform(X_interact, y)</code></pre>
<h3>Feature Importance</h3>
<p>Train a Random Forest to rank feature importance. Remove low-importance features to reduce overfitting and improve inference speed.</p>`,
        quiz: [
          { question: "What is the primary benefit of using PolynomialFeatures with interaction_only=True?", options: ["It creates polynomial features of degree 2", "It only creates interaction terms (no x^2 terms)", "It standardizes the features", "It selects the best features"], correctIndex: 1, explanation: "interaction_only=True excludes squared terms (x1^2, x2^2) and only creates cross-product terms (x1*x2), which are often more interpretable." }
        ]
      },
      {
        id: "model-evaluation", title: "Cross-Validation & Hyperparameter Tuning", duration: "55 min",
        description: "Master systematic model evaluation with cross-validation strategies and automated hyperparameter optimization.",
        content: `<h2>Cross-Validation Strategies</h2>
<p>Simple train-test splits are unreliable. K-Fold cross-validation provides a robust estimate of model performance by training on K-1 folds and validating on the remaining fold, rotating K times.</p>
<pre><code class="language-python">from sklearn.model_selection import GridSearchCV, KFold
from sklearn.ensemble import GradientBoostingRegressor

param_grid = {
    "n_estimators": [100, 200],
    "max_depth": [3, 5, 7],
    "learning_rate": [0.01, 0.1]
}

cv = KFold(n_splits=5, shuffle=True, random_state=42)
grid = GridSearchCV(GradientBoostingRegressor(), param_grid, cv=cv, scoring="neg_mean_squared_error")
grid.fit(X_train, y_train)

print(f"Best params: {grid.best_params_}")</code></pre>
<h3>Bayesian Optimization</h3>
<p>For larger search spaces, use <code>scikit-optimize</code> or <code>optuna</code> which intelligently explore the parameter space rather than brute-forcing all combinations.</p>`
      }
    ]
  },
  {
    id: "python-tier-4", title: "Tier 4: Advanced Visualization",
    lessons: [
      {
        id: "plotly-interactive", title: "Interactive Charts with Plotly", duration: "40 min",
        description: "Build interactive, publication-ready visualizations with Plotly that respond to hover, zoom, and selection events.",
        content: `<h2>Interactive Visualization</h2>
<p>Static charts limit exploration. <strong>Plotly</strong> generates interactive HTML-based visualizations with built-in tooltips, zoom, and pan—perfect for data exploration and dashboards.</p>
<pre><code class="language-python">import plotly.express as px
import pandas as pd

df = px.data.gapminder()

fig = px.scatter(
    df[df.year == 2007],
    x="gdpPercap", y="lifeExp",
    size="pop", color="continent",
    hover_name="country",
    log_x=True,
    title="GDP per Capita vs Life Expectancy (2007)"
)
fig.show()</code></pre>
<h3>Customization</h3>
<p>Everything is customizable: colors, annotations, axes, and layout. Use <code>fig.update_layout()</code> to fine-tune the appearance for publication-quality charts.</p>`,
        quiz: [
          { question: "What does plotly.express (px) provide compared to plotly.graph_objects (go)?", options: ["Lower-level control over every element", "A high-level API that generates complete figures with sensible defaults", "Only scatter plots", "Faster rendering speed"], correctIndex: 1, explanation: "plotly.express provides a high-level, concise API that creates complete figures with smart defaults from data in a single function call." }
        ]
      },
      {
        id: "streamlit-dashboards", title: "Data Dashboards with Streamlit", duration: "50 min",
        description: "Build interactive data dashboards and ML demos using Streamlit's reactive programming model.",
        content: `<h2>Rapid Dashboard Prototyping</h2>
<p>Streamlit turns Python scripts into interactive dashboards with zero frontend code. Every user interaction reruns the script, creating a natural reactive dataflow.</p>
<pre><code class="language-python">import streamlit as st
import pandas as pd
import plotly.express as px

st.title("Sales Dashboard")

uploaded_file = st.file_uploader("Upload CSV", type="csv")
if uploaded_file:
    df = pd.read_csv(uploaded_file)
    metric = st.selectbox("Select metric", df.select_dtypes("number").columns)
    fig = px.line(df, x="date", y=metric, title=f"{metric} Over Time")
    st.plotly_chart(fig, use_container_width=True)
    st.dataframe(df.describe())</code></pre>
<h3>Caching & Performance</h3>
<p>Use <code>@st.cache_data</code> to avoid recomputing expensive operations (like database queries or model inference) on every rerun, keeping your dashboard responsive.</p>`
      },
      {
        id: "seaborn-statistical", title: "Statistical Visualization with Seaborn", duration: "35 min",
        description: "Leverage Seaborn for statistical plots including distribution plots, heatmaps, and regression visualizations.",
        content: `<h2>Statistical Plotting</h2>
<p>Seaborn extends Matplotlib with statistical visualization primitives. It automatically computes aggregations, confidence intervals, and distributions for you.</p>
<pre><code class="language-python">import seaborn as sns
import matplotlib.pyplot as plt

tips = sns.load_dataset("tips")

# Distribution with KDE overlay
sns.histplot(data=tips, x="total_bill", hue="time", kde=True)

# Correlation heatmap
plt.figure(figsize=(10, 8))
sns.heatmap(tips.select_dtypes("number").corr(), annot=True, cmap="RdBu_r", center=0)

plt.show()</code></pre>
<h3>Facet Grids</h3>
<p>Use <code>sns.FacetGrid</code> to create multi-panel plots conditioned on categorical variables, revealing patterns across subgroups of your data.</p>`
      }
    ]
  },
  {
    id: "python-tier-5", title: "Tier 5: Production ML Deployment",
    lessons: [
      {
        id: "mlflow-tracking", title: "Experiment Tracking with MLflow", duration: "45 min",
        description: "Track experiments, parameters, and metrics systematically with MLflow to reproduce the best models.",
        content: `<h2>MLflow for Experiment Management</h2>
<p>Without experiment tracking, teams lose weeks rediscovering optimal parameters. <strong>MLflow</strong> logs parameters, metrics, artifacts, and models in a centralized registry.</p>
<pre><code class="language-python">import mlflow

mlflow.set_experiment("house-price-prediction")

with mlflow.start_run():
    params = {"n_estimators": 200, "max_depth": 7}
    mlflow.log_params(params)

    model = GradientBoostingRegressor(**params)
    model.fit(X_train, y_train)
    
    mse = mean_squared_error(y_test, model.predict(X_test))
    mlflow.log_metric("mse", mse)
    mlflow.sklearn.log_model(model, "model")</code></pre>
<h3>Model Registry</h3>
<p>Promote models through stages: Staging → Production → Archived. The Model Registry provides versioning, stage transitions, and deployment annotations.</p>`
      },
      {
        id: "fastapi-serving", title: "Model Serving with FastAPI", duration: "55 min",
        description: "Build production-grade REST APIs for ML models with FastAPI, validation, and async inference.",
        content: `<h2>Serving Models with FastAPI</h2>
<p>FastAPI provides automatic OpenAPI documentation, request validation with Pydantic, and async support—making it the ideal framework for ML model serving.</p>
<pre><code class="language-python">from fastapi import FastAPI
from pydantic import BaseModel
import joblib
import numpy as np

app = FastAPI()
model = joblib.load("model.pkl")

class PredictionRequest(BaseModel):
    features: list[float]

class PredictionResponse(BaseModel):
    prediction: float
    confidence: float

@app.post("/predict", response_model=PredictionResponse)
async def predict(request: PredictionRequest):
    X = np.array(request.features).reshape(1, -1)
    pred = model.predict(X)[0]
    proba = np.max(model.predict_proba(X))
    return PredictionResponse(prediction=pred, confidence=proba)</code></pre>
<h3>Batching & Async</h3>
<p>For high throughput, accept batches of inputs and use async database lookups. FastAPI with <code>uvicorn</code> handles thousands of concurrent requests with minimal overhead.</p>`,
        quiz: [
          { question: "What is the primary advantage of using FastAPI over Flask for ML model serving?", options: ["Faster request routing", "Automatic OpenAPI documentation and request validation via Pydantic", "Built-in GPU support", "Simpler syntax"], correctIndex: 1, explanation: "FastAPI automatically generates OpenAPI docs and validates requests using Pydantic models, catching malformed inputs before they reach your model." }
        ]
      },
      {
        id: "docker-ml", title: "Docker Containers for ML", duration: "50 min",
        description: "Containerize ML applications with Docker for reproducible deployments across any environment.",
        content: `<h2>Reproducible Environments</h2>
<p>Docker guarantees that your model runs identically in development, staging, and production by packaging the OS, Python version, and all dependencies into a portable image.</p>
<pre><code class="language-dockerfile">FROM python:3.11-slim

WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY model.pkl app.py .

EXPOSE 8000
CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "8000"]</code></pre>
<h3>Multi-Stage Builds</h3>
<p>Use multi-stage builds to keep images small. Build dependencies in one stage, then copy only the runtime artifacts to a slim final image, reducing attack surface and deployment time.</p>`
      }
    ]
  }
]

export default function PythonCoursePage() {
  return (
    <div className="bg-background text-foreground font-sans">
      <Navbar />
      <LessonPlayer
        title="Python & Data Science"
        description="Master the data ecosystem. From Python core syntax and vectorized NumPy arrays to high-performance Pandas analysis and production ML pipelines."
        category="AI & Data"
        accentColor="#FFD43B"
        modules={pythonModules}
        instructor="Wes McKinney"
        rating={4.9}
        reviewCount={8100}
        lastUpdated="Mar 2026"
      />
    </div>
  )
}
