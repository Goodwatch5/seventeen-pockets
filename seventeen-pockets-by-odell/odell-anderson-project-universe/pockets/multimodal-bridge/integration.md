# Multimodal Bridge Integration Guide

## Overview

The Multimodal Bridge pocket integrates with other Seventeen Pockets services to provide vision-text processing capabilities across the ecosystem.

## Integration Points

### 1. Nexus (Visualization Dashboard)

**Use Case**: Analyze infrastructure diagrams and visualizations

```python
# From Nexus service
from multimodal_bridge import MultimodalBridgeInference

inference = MultimodalBridgeInference()

# Analyze a dashboard screenshot
result = inference.analyze_infrastructure_diagram(
    image_path="/path/to/dashboard.png",
    analysis_type="components"
)

print(result['output'])  # Component analysis
```

### 2. Data Pipeline

**Use Case**: Process logs with visual context

```python
# From Data Pipeline service
log_data = fetch_logs(service="api-gateway", hours=1)

result = inference.process_logs_with_context(
    log_content=log_data,
    image_context="/path/to/architecture.png"
)

store_analysis(result['output'])
```

### 3. Documentation Service

**Use Case**: Auto-generate documentation from diagrams

```python
# From Documentation service
result = inference.generate_documentation(
    image_path="/path/to/system_diagram.png",
    context="Microservices architecture with 5 services"
)

save_documentation(result['output'])
```

### 4. Automation Panel

**Use Case**: Generate automation scripts from requirements

```python
# From Automation Panel
result = inference.process_image_text(
    image_path="/path/to/workflow.png",
    text_prompt="Generate a Terraform script for this infrastructure",
    task_type="code_generation"
)

generate_script(result['output'])
```

## API Endpoints

### Health Check

```bash
GET /health
```

### Text-to-Text

```bash
POST /api/v1/text-to-text
Content-Type: application/json

{
  "text": "Explain microservices",
  "task_type": "explanation",
  "max_length": 512
}
```

### Image-Text-to-Text

```bash
POST /api/v1/image-text-to-text
Content-Type: multipart/form-data

file: <image_file>
text_prompt: "Analyze this diagram"
task_type: "analysis"
```

### Infrastructure Analysis

```bash
POST /api/v1/analyze-infrastructure
Content-Type: multipart/form-data

file: <diagram_image>
analysis_type: "full"  # or: components, risks, optimization
```

### Documentation Generation

```bash
POST /api/v1/generate-documentation
Content-Type: multipart/form-data

file: <optional_image>
context: "System description"
```

### Log Analysis

```bash
POST /api/v1/analyze-logs
Content-Type: application/json

{
  "log_content": "[ERROR] Database connection failed..."
}
```

### Batch Processing

```bash
POST /api/v1/batch-process
Content-Type: application/json

[
  {
    "text_prompt": "What is Kubernetes?",
    "task_type": "explanation"
  },
  {
    "text_prompt": "Explain Docker",
    "task_type": "explanation"
  }
]
```

## Deployment

### Docker Deployment

```bash
# Build image
docker build -t multimodal-bridge:latest .

# Run container
docker run --gpus all -p 8000:8000 \
  -v $(pwd)/models:/app/models \
  multimodal-bridge:latest
```

### Docker Compose

```bash
docker-compose up -d
```

### Kubernetes Deployment

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: multimodal-bridge
spec:
  replicas: 2
  selector:
    matchLabels:
      app: multimodal-bridge
  template:
    metadata:
      labels:
        app: multimodal-bridge
    spec:
      containers:
      - name: multimodal-bridge
        image: multimodal-bridge:latest
        ports:
        - containerPort: 8000
        resources:
          requests:
            nvidia.com/gpu: 1
          limits:
            nvidia.com/gpu: 1
        livenessProbe:
          httpGet:
            path: /health
            port: 8000
          initialDelaySeconds: 30
          periodSeconds: 10
```

## Performance Tuning

### Batch Size Optimization

```python
# For throughput (higher batch size)
config = InferenceConfig(
    batch_size=64,
    max_length=512
)

# For latency (lower batch size)
config = InferenceConfig(
    batch_size=1,
    max_length=256
)
```

### Memory Management

```python
# Enable gradient checkpointing for training
model.model.gradient_checkpointing_enable()

# Use mixed precision
from torch.cuda.amp import autocast
with autocast():
    outputs = model(input_ids, attention_mask)
```

## Monitoring

### Metrics to Track

* **Latency**: p50, p95, p99 inference times
* **Throughput**: Requests per second
* **Token Usage**: Input/output tokens per request
* **Error Rate**: Failed requests percentage
* **GPU Utilization**: Memory and compute usage
* **Model Drift**: Performance degradation over time

### Prometheus Metrics

```python
from prometheus_client import Counter, Histogram

inference_counter = Counter(
    'multimodal_bridge_inferences_total',
    'Total inferences',
    ['task_type', 'status']
)

inference_latency = Histogram(
    'multimodal_bridge_inference_duration_seconds',
    'Inference latency',
    ['task_type']
)
```

## Troubleshooting

### Out of Memory

```python
# Reduce batch size
config.batch_size = 16

# Reduce max length
config.max_length = 256

# Enable gradient checkpointing
model.model.gradient_checkpointing_enable()
```

### Slow Inference

```python
# Use fewer beams
config.num_beams = 2

# Reduce max length
config.max_length = 256

# Enable quantization
from transformers import AutoModelForSeq2SeqLM
model = AutoModelForSeq2SeqLM.from_pretrained(
    model_id,
    load_in_8bit=True
)
```

### Poor Quality Output

* Increase `num_beams` for better quality
* Adjust `temperature` (lower = more deterministic)
* Fine-tune on domain-specific data
* Increase `max_length` for longer outputs

## Support

For issues or questions, contact the Seventeen Pockets team or open an issue in the project repository.
