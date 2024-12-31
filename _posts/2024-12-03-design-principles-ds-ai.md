---
layout: post
title: "✍ A Path to Maintainable AI Systems using Norman's Design Principles"
date: 2024-12-03
tags: [ai, data-science, design-principles, code-quality, mlops, monitoring, observability, production, model-governance, minimal]
---
<!--more-->

## Introduction
Don Norman's principles of good design, outlined in [The Design of Everyday Things](https://archive.org/details/thedesignofeverydaythingsbydonnorman), are particularly relevant to Data Science and AI Engineering, where systems often suffer from unnecessary complexity. This article presents a minimalist approach to implementing these principles using a carefully selected set of tools that maximise impact while reducing operational overhead. Norman's insights about visibility, feedback, constraints, and mappings translate powerfully to AI system design, where abstract interfaces and complex workflows can easily become overwhelming. Just as Norman observed that poorly designed physical objects lead to user frustration and errors, poorly architected AI systems can result in maintenance nightmares, hidden failure modes, and costly debugging cycles. By applying his principles - making system states visible, providing clear feedback, implementing appropriate constraints, and creating natural mappings between components, we can build AI systems that are not only more intuitive to use but also easier to maintain, debug, and evolve over time.

## Design Principles Implementation
### 1. Visibility
Implement comprehensive system observability using [MLflow](https://mlflow.org/) as your central platform:

- Track experiments, parameters, and metrics
- Version models and artefacts
- Log production predictions and outcomes
- Monitor model performance metrics

For system-level metrics, use [Prometheus/Grafana](https://prometheus.io/docs/visualization/grafana/) to:
- Track resource utilisation (CPU, memory, latency)
- Monitor prediction throughput
- Create dashboards for key performance indicators

Implement adaptive sampling for high-volume systems:
```python
def should_log(request_id, sampling_rate=0.1):
    return hash(request_id) % 100 < (sampling_rate * 100)
```

### 2. Feedback
Use [Prometheus/Grafana](https://prometheus.io/docs/visualization/grafana/) for real-time monitoring and alerting:

- Set up alerts for model performance degradation
- Monitor data distribution shifts
- Track system health metrics
- Configure tiered alerting based on severity

Example metric collection:
```python
from prometheus_client import Counter, Histogram

PREDICTIONS = Counter('model_predictions_total', 'Total predictions made')
LATENCY = Histogram('prediction_latency_seconds', 'Time spent processing prediction')

def predict(features):
    with LATENCY.time():
        prediction = model.predict(features)
        PREDICTIONS.inc()
        return prediction
```

### 3. Constraints
Implement data and model guardrails using [Great Expectations](https://greatexpectations.io/):

- Define data quality expectations
- Set distribution bounds for features
- Monitor for data drift
- Generate validation reports

Example constraint implementation:
```python
from great_expectations.dataset import Dataset

def validate_features(df):
    dataset = Dataset(df)
    dataset.expect_column_values_to_be_between("age", 0, 120)
    dataset.expect_column_values_to_not_be_null("critical_feature")
    validation_result = dataset.validate()
    return validation_result.success
```

### 4. Mappings
Use [MLflow](https://mlflow.org/) to maintain clear relationships between:

- Experiments and business objectives
- Models and their training data
- Predictions and outcomes
- Performance metrics and business KPIs

Example mapping structure:
```python
with mlflow.start_run(run_name="production_model_v1"):
    mlflow.log_param("business_objective", "customer_churn")
    mlflow.log_param("data_version", data_hash)
    mlflow.log_metric("business_impact", revenue_improvement)
    mlflow.log_artifact("feature_importance.json")
```

### 5. Error Prevention and Recovery
Integrate safeguards using your core toolset:

[MLflow](https://mlflow.org/):
- Version control for models and artefacts
- Rollback capabilities
- Experiment tracking for reproducibility

[Prometheus/Grafana](https://prometheus.io/docs/visualization/grafana/):
- Early warning system for issues
- Performance degradation detection
- Resource exhaustion prevention

[Great Expectations](https://greatexpectations.io/):
- Data quality validation
- Schema enforcement
- Distribution monitoring

Example error prevention:
```python
def safe_predict(features):
    if not validate_features(features):
        return fallback_prediction()
    
    try:
        with LATENCY.time():
            prediction = model.predict(features)
            PREDICTIONS.inc()
            return prediction
    except Exception as e:
        ERROR_COUNTER.inc()
        return fallback_prediction()
```

## Implementation Strategy
1. Start with [MLflow](https://mlflow.org/)
   - Set up experiment tracking
   - Implement model versioning
   - Configure basic logging

2. Add [Prometheus/Grafana](https://prometheus.io/docs/visualization/grafana/)
   - Deploy basic monitoring
   - Set up key alerts
   - Create essential dashboards

3. Integrate [Great Expectations](https://greatexpectations.io/)
   - Define core data quality rules
   - Implement validation pipelines
   - Monitor data distributions

## Conclusions
By focusing on a minimal set of powerful tools ([MLflow](https://mlflow.org/), [Prometheus/Grafana](https://prometheus.io/docs/visualization/grafana/), and [Great Expectations](https://greatexpectations.io/)), you can implement Norman's design principles effectively while maintaining system simplicity. This approach provides:

- Comprehensive visibility through unified logging and monitoring
- Immediate feedback via real-time alerts
- Strong constraints through data validation
- Clear mappings between components
- Robust error prevention and recovery

The key is to fully utilise these core tools rather than adding complexity with additional solutions. This creates maintainable, observable, and reliable AI systems that can scale with your needs.
