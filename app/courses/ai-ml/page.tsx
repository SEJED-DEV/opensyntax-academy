import type { Metadata } from "next"
import { Navbar } from "@/components/navbar"
import { LessonPlayer, type Module } from "@/components/lesson-player"

export const metadata: Metadata = {
  title: "AI/ML Engineering Course — PyTorch, RAG, LLMs & MLOps",
  description: "Build production AI systems. From linear algebra and PyTorch fundamentals to RAG pipelines, vector databases, LoRA fine-tuning, RLHF evaluation, and comprehensive MLOps for deploying and monitoring LLMs at scale.",
  keywords: ["AI Course", "Machine Learning Tutorial", "PyTorch Course", "RAG Pipeline", "LLM Fine-Tuning", "MLOps", "Vector Database", "RLHF", "LoRA", "LangChain"],
}

const aimlModules: Module[] = [
  {
    id: "ai-tier-1", title: "Tier 1: Foundations — Linear Algebra & Data Structures",
    lessons: [
      {
        id: "math-for-ai", title: "Linear Algebra & Gradients", duration: "30 min",
        description: "The mathematical backbone of AI. Matrices, vectors, and how gradients drive backpropagation.",
        content: `<h2>Linear Algebra in AI</h2>
<p>Models are just vast collections of weights stored in matrices. To optimize them, we calculate <strong>gradients</strong>—the slope of the loss function—which tell us how to nudge weights to reduce error.</p>
<pre><code class="language-python">import numpy as np

# Matrix multiplication for a neural layer
X = np.random.randn(4, 3)  # batch of 4 samples, 3 features
W = np.random.randn(3, 2)  # weight matrix
b = np.zeros(2)            # bias

output = X @ W + b  # forward pass
print(output.shape)  # (4, 2)</code></pre>
<h3>NumPy Vectorization</h3>
<p>We use <strong>NumPy</strong> for high-performance array processing. Vectorized operations allow us to avoid slow Python loops, executing math in optimized C-code instead.</p>`,
        quiz: [
          { question: "What is the shape of the output when multiplying a (4, 3) matrix by a (3, 2) matrix?", options: ["(4, 2)", "(3, 3)", "(4, 3)", "(2, 4)"], correctIndex: 0, explanation: "Matrix multiplication of (m, n) and (n, p) produces a (m, p) matrix. So (4, 3) @ (3, 2) = (4, 2)." }
        ]
      },
      {
        id: "python-for-ml", title: "Python & NumPy for Machine Learning", duration: "35 min",
        description: "Master the Python data science stack with NumPy arrays, broadcasting, and vectorized operations for ML.",
        content: `<h2>NumPy Broadcasting</h2>
<p>Broadcasting allows NumPy to perform arithmetic between arrays of different shapes without explicit loops. This is essential for efficient ML preprocessing.</p>
<pre><code class="language-python">import numpy as np

# Standardize features (Z-score)
data = np.random.randn(1000, 10)
mean = data.mean(axis=0)
std = data.std(axis=0)

# Broadcasting: (1000, 10) - (10,) / (10,) => (1000, 10)
normalized = (data - mean) / std

# One-hot encoding
labels = np.array([0, 2, 1, 2, 0])
one_hot = np.eye(3)[labels]</code></pre>
<h3>Random Seeds & Reproducibility</h3>
<p>Always set <code>np.random.seed(42)</code> before generating data or initializing weights to ensure your experiments are reproducible across runs.</p>`
      },
      {
        id: "data-prep", title: "Data Preparation & Preprocessing", duration: "40 min",
        description: "Build production data pipelines covering normalization, encoding, splitting strategies, and data augmentation.",
        content: `<h2>Data Splitting Strategies</h2>
<p>Proper data splitting prevents data leakage. Always split before any scaling or imputation to avoid inflating your model's performance metrics.</p>
<pre><code class="language-python">from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler, LabelEncoder

X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42, stratify=y
)

# Fit scaler only on training data
scaler = StandardScaler()
X_train_scaled = scaler.fit_transform(X_train)
X_test_scaled = scaler.transform(X_test)

# Encode categorical labels
encoder = LabelEncoder()
y_train_enc = encoder.fit_transform(y_train)
y_test_enc = encoder.transform(y_test)</code></pre>
<h3>Data Augmentation</h3>
<p>For image and text data, augmentation (rotation, cropping, synonym replacement) artificially expands your dataset, reducing overfitting and improving generalization.</p>`
      }
    ]
  },
  {
    id: "ai-tier-2", title: "Tier 2: Intermediate — Model Training & PyTorch",
    lessons: [
      {
        id: "pytorch-nn", title: "Neural Networks with PyTorch", duration: "45 min",
        description: "Building your first multi-layer perceptron. Understanding layers, optimizers, and loss functions.",
        content: `<h2>Deep Learning with PyTorch</h2>
<p>PyTorch provides a dynamic computational graph. You define the architecture, and it handles the complex calculus via <strong>autograd</strong>.</p>
<pre><code class="language-python">import torch
import torch.nn as nn

class SimpleNet(nn.Module):
    def __init__(self):
        super().__init__()
        self.fc = nn.Linear(10, 1)

    def forward(self, x):
        return self.fc(x)</code></pre>`,
        quiz: [
          { question: "What does autograd in PyTorch automatically compute?", options: ["Model accuracy", "Gradients of tensors with respect to loss", "Learning rate schedules", "Batch sizes"], correctIndex: 1, explanation: "autograd automatically computes gradients by tracing operations on tensors, enabling backpropagation without manual derivative calculations." }
        ]
      },
      {
        id: "cnn-vision", title: "CNNs for Computer Vision", duration: "50 min",
        description: "Build convolutional neural networks for image classification, object detection, and feature extraction.",
        content: `<h2>Convolutional Architecture</h2>
<p>CNNs use learned filters (kernels) that slide across input images, detecting edges, textures, and increasingly abstract features in deeper layers.</p>
<pre><code class="language-python">import torch.nn as nn

class ImageClassifier(nn.Module):
    def __init__(self):
        super().__init__()
        self.conv = nn.Sequential(
            nn.Conv2d(3, 16, 3, padding=1),
            nn.ReLU(),
            nn.MaxPool2d(2),
            nn.Conv2d(16, 32, 3, padding=1),
            nn.ReLU(),
            nn.MaxPool2d(2),
        )
        self.fc = nn.Linear(32 * 8 * 8, 10)

    def forward(self, x):
        x = self.conv(x)
        x = x.view(x.size(0), -1)
        return self.fc(x)</code></pre>
<h3>Transfer Learning</h3>
<p>Leverage pretrained models (ResNet, EfficientNet) and fine-tune only the final layers on your custom dataset. This requires far less data and compute than training from scratch.</p>`
      },
      {
        id: "transformers-intro", title: "Transformer Architecture & Attention", duration: "60 min",
        description: "Master the self-attention mechanism that powers modern LLMs, from scaled dot-product to multi-head attention.",
        content: `<h2>Attention Is All You Need</h2>
<p>The Transformer processes sequences in parallel (unlike RNNs) using <strong>self-attention</strong>, which computes weighted relationships between every pair of tokens in the input.</p>
<pre><code class="language-python">import torch
import torch.nn.functional as F

def scaled_dot_product_attention(Q, K, V):
    """
    Q, K, V: (batch, seq_len, d_k)
    """
    scores = Q @ K.transpose(-2, -1)  # (batch, seq_len, seq_len)
    scores = scores / (K.size(-1) ** 0.5)  # scale
    weights = F.softmax(scores, dim=-1)
    return weights @ V  # weighted sum</code></pre>
<h3>Multi-Head Attention</h3>
<p>Instead of one attention function, multi-head attention runs multiple attention operations in parallel (typically 8–16 heads), each learning different relationship patterns in the data.</p>`
      }
    ]
  },
  {
    id: "ai-tier-3", title: "Tier 3: Production — RAG & Local SLM",
    lessons: [
      {
        id: "rag-slm", title: "RAG Pipelines & Local SLM Quantization", duration: "60 min",
        description: "Retrieval-Augmented Generation with Qdrant and local model deployment via Ollama/GGUF.",
        content: `<h2>Production AI Architecture</h2>
<p>Production systems don't just 'use ChatGPT'. We build <strong>RAG (Retrieval-Augmented Generation)</strong> pipelines to ground responses in corporate data using vector databases like <strong>Qdrant</strong>.</p>
<h3>Local Inference</h3>
<p>To ensure zero tracking and lower latency, we deploy <strong>Small Language Models (SLMs)</strong> locally. We use <strong>quantization</strong> (turning 32-bit weights into 4-bit integers) to run 7B+ parameter models on consumer hardware.</p>
<p><strong>Security Note:</strong> Always implement input sanitization to protect your model endpoints against prompt injection attacks.</p>`
      },
      {
        id: "lora-fine-tuning", title: "Parameter-Efficient Fine-Tuning with LoRA", duration: "55 min",
        description: "Fine-tune large language models with consumer GPUs using Low-Rank Adaptation (LoRA) and QLoRA.",
        content: `<h2>LoRA: Low-Rank Adaptation</h2>
<p>Full fine-tuning of LLMs is prohibitively expensive. <strong>LoRA</strong> injects trainable rank-decomposition matrices into attention layers, reducing trainable parameters by 10,000x while maintaining performance.</p>
<pre><code class="language-python">from peft import LoraConfig, get_peft_model
from transformers import AutoModelForCausalLM

model = AutoModelForCausalLM.from_pretrained("mistralai/Mistral-7B-v0.1")

lora_config = LoraConfig(
    r=8,  # rank
    lora_alpha=32,
    target_modules=["q_proj", "v_proj"],
    lora_dropout=0.05,
    bias="none",
    task_type="CAUSAL_LM"
)

model = get_peft_model(model, lora_config)
print(f"Trainable params: {model.num_parameters(only_trainable=True):,}")</code></pre>
<h3>QLoRA: Quantized LoRA</h3>
<p>QLoRA combines 4-bit quantization of the base model with LoRA adapters, allowing you to fine-tune 65B+ parameter models on a single RTX 4090 GPU.</p>`,
        quiz: [
          { question: "What is the rank parameter (r) in LoRA controlling?", options: ["The number of attention heads", "The dimension of the low-rank matrices injected into the model", "The learning rate", "The batch size"], correctIndex: 1, explanation: "The rank r controls the dimension of the low-rank decomposition matrices A and B (where ΔW = AB). Higher r means more expressiveness but more parameters." }
        ]
      },
      {
        id: "model-evaluation-llm", title: "Evaluating LLMs & Safety", duration: "45 min",
        description: "Master LLM evaluation techniques including perplexity, benchmark suites, bias detection, and safety guardrails.",
        content: `<h2>LLM Evaluation</h2>
<p>Standard metrics like accuracy don't capture the nuances of generative models. We use perplexity, ROUGE, BLEU, and task-specific benchmarks (MMLU, HellaSwag, HumanEval) to evaluate LLM performance.</p>
<pre><code class="language-python">from datasets import load_dataset
from transformers import AutoModelForCausalLM, AutoTokenizer
import torch

model = AutoModelForCausalLM.from_pretrained("model-name")
tokenizer = AutoTokenizer.from_pretrained("model-name")

def compute_perplexity(text: str) -> float:
    inputs = tokenizer(text, return_tensors="pt")
    with torch.no_grad():
        outputs = model(**inputs, labels=inputs["input_ids"])
    return torch.exp(outputs.loss).item()

# Safety guardrail prompt
SYSTEM_PROMPT = "You are a helpful, harmless assistant."
user_query = "Explain how neural networks work"
safe_prompt = f"{SYSTEM_PROMPT}\n\nUser: {user_query}\nAssistant:"</code></pre>
<h3>Bias & Toxicity</h3>
<p>Use tools like <code>lm-evaluation-harness</code> and toxicity classifiers (Detoxify, Perspective API) to systematically detect harmful outputs before deployment.</p>`
      }
    ]
  },
  {
    id: "ai-tier-4", title: "Tier 4: Vector Databases & Embeddings",
    lessons: [
      {
        id: "embedding-models", title: "Text Embeddings & Semantic Search", duration: "40 min",
        description: "Transform text into dense vector representations using embedding models like OpenAI Ada, Sentence Transformers, and BGE.",
        content: `<h2>Text Embeddings</h2>
<p>Embeddings convert text into fixed-size vectors that capture semantic meaning. Similar texts produce vectors that are close together in the embedding space.</p>
<pre><code class="language-python">from sentence_transformers import SentenceTransformer

model = SentenceTransformer("BAAI/bge-base-en-v1.5")

documents = [
    "Transformers revolutionized NLP",
    "Python is a programming language",
    "Neural networks learn from data"
]

# Normalize embeddings for cosine similarity
embeddings = model.encode(documents, normalize_embeddings=True)
print(f"Embedding shape: {embeddings.shape}")  # (3, 768)</code></pre>
<h3>Semantic Search</h3>
<p>Given a query, compute its embedding and find the most similar documents using cosine similarity. This powers RAG, recommendation systems, and deduplication.</p>`,
        quiz: [
          { question: "Why should embeddings be normalized before computing cosine similarity?", options: ["It makes them larger", "Normalized embeddings allow cosine similarity to be computed as a simple dot product", "It reduces dimensionality", "It improves training speed"], correctIndex: 1, explanation: "When embeddings are unit vectors (L2-norm = 1), cosine similarity equals the dot product, which is computationally cheaper than computing cos(θ) directly." }
        ]
      },
      {
        id: "pinecone-weaviate", title: "Vector Databases: Pinecone & Weaviate", duration: "50 min",
        description: "Deploy and query vector databases for production RAG systems using Pinecone and Weaviate.",
        content: `<h2>Vector Database Fundamentals</h2>
<p>Vector databases index embeddings for fast approximate nearest neighbor (ANN) search. They support hybrid filtering (metadata + vector) essential for production RAG.</p>
<pre><code class="language-python">import weaviate
import weaviate.classes as wvc

client = weaviate.connect_to_local()

# Define a collection with vectorizer
collection = client.collections.create(
    name="Document",
    properties=[
        wvc.Property(name="title", data_type=wvc.DataType.TEXT),
        wvc.Property(name="content", data_type=wvc.DataType.TEXT),
    ]
)

# Insert with embeddings
collection.data.insert({
    "title": "Deep Learning Guide",
    "content": "Neural networks with PyTorch..."
})

# Vector search
response = collection.query.near_text(
    query="neural networks",
    limit=5
)</code></pre>
<h3>Pinecone Serverless</h3>
<p>Pinecone's serverless tier automatically scales based on usage. Namespaces allow you to partition data by tenant, use case, or data source within a single index.</p>`
      },
      {
        id: "chunking-strategies", title: "Document Chunking Strategies", duration: "35 min",
        description: "Master chunking techniques for RAG: fixed-size, semantic, and agentic chunking with overlap strategies.",
        content: `<h2>Chunking for RAG</h2>
<p>Documents must be split into chunks before embedding. The chunk size and overlap significantly impact retrieval quality. Too small loses context, too large dilutes relevance.</p>
<pre><code class="language-python">from langchain.text_splitter import RecursiveCharacterTextSplitter

text_splitter = RecursiveCharacterTextSplitter(
    chunk_size=512,
    chunk_overlap=128,
    separators=["\n\n", "\n", ".", " ", ""],
    length_function=len
)

document = "Long document text..." * 100
chunks = text_splitter.split_text(document)

print(f"Created {len(chunks)} chunks")
for i, chunk in enumerate(chunks[:3]):
    print(f"Chunk {i}: {len(chunk)} chars")</code></pre>
<h3>Semantic Chunking</h3>
<p>Instead of fixed sizes, semantic chunking splits at topic boundaries using embedding similarity or NLP models, producing more coherent and retrievable chunks.</p>`
      },
      {
        id: "cosine-similarity", title: "Cosine Similarity & Hybrid Search", duration: "30 min",
        description: "Implement cosine similarity search and combine dense vector search with keyword-based BM25 for hybrid retrieval.",
        content: `<h2>Similarity Metrics</h2>
<p>Cosine similarity measures the angle between two vectors, returning values from -1 (opposite) to 1 (identical). This is the standard metric for embedding search.</p>
<pre><code class="language-python">import numpy as np

def cosine_similarity(a: np.ndarray, b: np.ndarray) -> float:
    return np.dot(a, b) / (np.linalg.norm(a) * np.linalg.norm(b))

# Hybrid search: combine dense + sparse
def hybrid_score(
    dense_sim: float,
    sparse_sim: float,
    alpha: float = 0.7
) -> float:
    return alpha * dense_sim + (1 - alpha) * sparse_sim</code></pre>
<h3>Hybrid Search</h3>
<p>Dense embeddings capture semantics; sparse (BM25) captures exact keyword matches. Hybrid search combines both, providing robust retrieval even when queries contain rare or domain-specific terms.</p>`
      }
    ]
  },
  {
    id: "ai-tier-5", title: "Tier 5: RLHF & Evaluation",
    lessons: [
      {
        id: "reward-modeling", title: "Reward Modeling Fundamentals", duration: "45 min",
        description: "Build reward models that capture human preferences and guide RLHF-based LLM alignment.",
        content: `<h2>Reward Models</h2>
<p>A reward model takes a prompt and response and outputs a scalar score representing human preference. It is trained on pairwise comparisons where humans choose the better response.</p>
<pre><code class="language-python">import torch
import torch.nn as nn

class RewardModel(nn.Module):
    def __init__(self, base_model, hidden_size=768):
        super().__init__()
        self.base_model = base_model
        self.reward_head = nn.Sequential(
            nn.Linear(hidden_size, 256),
            nn.ReLU(),
            nn.Linear(256, 1)
        )

    def forward(self, input_ids, attention_mask):
        outputs = self.base_model(
            input_ids=input_ids,
            attention_mask=attention_mask
        )
        # Use [CLS] token representation
        pooled = outputs.last_hidden_state[:, 0, :]
        return self.reward_head(pooled).squeeze(-1)</code></pre>
<h3>Bradley-Terry Loss</h3>
<p>The reward model is trained using the Bradley-Terry preference model: <code>loss = -log(σ(reward_chosen - reward_rejected))</code>, maximizing the margin between preferred and dispreferred responses.</p>`,
        quiz: [
          { question: "What does the Bradley-Terry loss function maximize in reward model training?", options: ["The absolute value of both rewards", "The probability that the chosen response is preferred over the rejected one", "The sum of all rewards", "The variance between rewards"], correctIndex: 1, explanation: "Bradley-Terry loss maximizes the log probability that the chosen response has a higher reward than the rejected response, formalized as -log(σ(r_chosen - r_rejected))." }
        ]
      },
      {
        id: "human-feedback", title: "Collecting & Using Human Feedback", duration: "40 min",
        description: "Design feedback collection interfaces, manage annotator agreement, and integrate human preferences into model alignment.",
        content: `<h2>Feedback Collection Pipeline</h2>
<p>High-quality human feedback is the bottleneck for RLHF. We design pairwise comparison tasks with clear rubrics, inter-annotator agreement checks, and reward model training loops.</p>
<pre><code class="language-python">import json

def prepare_comparison_data(
    prompt: str,
    response_a: str,
    response_b: str,
    preference: int  # 0: A wins, 1: B wins, -1: tie
) -> dict:
    return {
        "prompt": prompt,
        "chosen": response_a if preference == 0 else response_b,
        "rejected": response_b if preference == 0 else response_a
    }

# Batch for training
comparisons = [
    prepare_comparison_data("Explain quantum computing", resp_a, resp_b, 0)
    for resp_a, resp_b in zip(responses_a, responses_b)
]

with open("rlhf_data.json", "w") as f:
    json.dump(comparisons, f, indent=2)</code></pre>
<h3>Annotator Agreement</h3>
<p>Track Cohen's Kappa between annotators to ensure data quality. Low agreement indicates ambiguous prompts or unclear rubrics—both must be iteratively refined.</p>`
      },
      {
        id: "bleu-rouge", title: "BLEU, ROUGE & Evaluation Metrics", duration: "35 min",
        description: "Master NLP evaluation metrics for text generation: BLEU precision, ROUGE recall, METEOR, and perplexity.",
        content: `<h2>BLEU Score</h2>
<p>BLEU measures n-gram precision between generated and reference texts. It's widely used for machine translation but has limitations for creative generation.</p>
<pre><code class="language-python">from nltk.translate.bleu_score import sentence_bleu, SmoothingFunction
from rouge_score import rouge_scorer

reference = "the cat sat on the mat"
hypothesis = "the cat sat on the mat"

# BLEU with smoothing for short texts
smooth = SmoothingFunction().method4
bleu = sentence_bleu([reference.split()], hypothesis.split(), smoothing_function=smooth)

# ROUGE score
scorer = rouge_scorer.RougeScorer(["rouge1", "rougeL"], use_stemmer=True)
scores = scorer.score(reference, hypothesis)
print(f"ROUGE-1: {scores['rouge1'].fmeasure:.3f}")
print(f"ROUGE-L: {scores['rougeL'].fmeasure:.3f}")</code></pre>
<h3>Choosing the Right Metric</h3>
<p>BLEU is precision-oriented (penalizes extra words), ROUGE is recall-oriented (penalizes missing words). For summarization, ROUGE is preferred; for translation, BLEU remains standard.</p>`
      },
      {
        id: "eval-datasets", title: "Building Evaluation Datasets & Benchmarks", duration: "45 min",
        description: "Create and curate evaluation datasets for LLMs, covering factual accuracy, instruction following, and safety.",
        content: `<h2>Benchmark Design</h2>
<p>Good evaluation datasets measure specific capabilities: factual recall (MMLU, TriviaQA), reasoning (GSM8K, BBH), code generation (HumanEval), and instruction following (MT-Bench, AlpacaEval).</p>
<pre><code class="language-python">from datasets import load_dataset
from evaluate import load as load_metric

mmlu = load_dataset("mmlu", "abstract_algebra", split="test")
accuracy = load_metric("accuracy")

def evaluate_on_mmlu(model, tokenizer, dataset):
    correct = 0
    for sample in dataset:
        prompt = f"Question: {sample['question']}\n"
        prompt += "\n".join(f"{chr(65+i)}) {opt}" for i, opt in enumerate(sample["choices"]))
        prompt += "\nAnswer:"

        inputs = tokenizer(prompt, return_tensors="pt")
        output = model.generate(**inputs, max_new_tokens=1)
        predicted = chr(65 + torch.argmax(output.logits[0, -1, :4]).item())

        if predicted == sample["answer"]:
            correct += 1

    return correct / len(dataset)</code></pre>
<h3>Custom Eval Sets</h3>
<p>For domain-specific applications, curate your own evaluation dataset using production logs. Include edge cases, adversarial inputs, and golden reference answers to track regressions over time.</p>`
      }
    ]
  }
]

export default function AILearningPage() {
  return (
    <div className="bg-background text-foreground font-sans">
      <Navbar />
      <LessonPlayer
        title="AI/ML Engineering"
        description="Master the full AI stack. From linear algebra and vectorized NumPy data structures to production RAG pipelines and local SLM inference."
        category="AI & Data"
        accentColor="#A259FF"
        modules={aimlModules}
        instructor="Harrison Chase"
        rating={5.0}
        reviewCount={950}
        lastUpdated="Mar 2026"
      />
    </div>
  )
}
