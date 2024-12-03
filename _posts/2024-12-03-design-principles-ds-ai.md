---
layout: post
title: "Applying Norman's Design Principles to Data Science and AI Engineering"
date: 2024-12-03
tags: [ai, data-science, design-principles, code-quality, mlops, monitoring, observability, production-ai, model-governance]
---
<!--more-->

## Introduction
Don Norman's principles of good design, outlined in [The Design of Everyday Things](https://archive.org/details/thedesignofeverydaythingsbydonnorman), are particularly relevant to Data Science and AI Engineering as these systems face unique challenges: complexity in data pipelines, opacity in model decisions, and difficulties in monitoring system health. Just as Norman advocates for user-centred design in physical objects, applying these principles helps create AI systems that are maintainable, observable, and reliable. This is crucial as AI systems serve diverse users -from Data Scientists and Engineers to business stakeholders and end users.  
In this article, I'll endeavour to correctly apply Norman's design principles on more sustainable and reliable AI systems. 


## Design Principles in Data and AI 
### 1. Visibility
In Data Science and AI Engineering, visibility means exposing the right information at the right granularity. Here's how to implement it effectively:

**System Observability**
- Implement comprehensive logging across pipeline stages (using tools like [MLflow](https://mlflow.org/))
- Track data lineage from ingestion to model output (e.g. [Great Expectations](https://greatexpectations.io/) for data validation)
- Monitor resource usage and system performance (using [Prometheus/Grafana](https://prometheus.io/docs/visualization/grafana/))

**Monitoring Costs vs Benefits**:  
- Calculate storage costs based on your provider
- Be aware of CPU overhead
- There will be a memory impact as well
- Consider sampling strategies for high-volume systems:  

```python
# Example: Adaptive sampling based on traffic
def should_log(request_id, sampling_rate=0.1):
    return hash(request_id) % 100 < (sampling_rate * 100)
```

**Model Transparency**
- Expose feature importance and decision paths (see [SHAP](https://christophm.github.io/interpretable-ml-book/shap.html), [LIME](https://christophm.github.io/interpretable-ml-book/lime.html))
- Track prediction confidence scores
- Maintain versioning for models and datasets ([DVC](https://dvc.org/) or [Git LFS](https://git-lfs.com/))

**Runtime Insights**
- Deploy real-time monitoring dashboards
- Track key performance metrics (latency, throughput, accuracy)
- Set up anomaly detection for critical metrics

**Challenges and Considerations**:
- Balancing granularity of logging vs system performance
- Storage costs for comprehensive logging
- Security implications of exposed metrics

### 2. Feedback
Effective feedback in Data Science and AI systems provides immediate, actionable information about system behaviour. This allows for quick detection and resolution of issues before they escalate.  

**Data Quality Feedback**:  
- Validate data against schema on ingestion to catch errors early
- Report statistical distribution shifts to identify data drift  
- Alert on missing or corrupted data points to maintain data integrity

**Model Performance Feedback**:  
- Track prediction accuracy, inference latency, and other key metrics in production
- Monitor model drift from the baseline to detect performance degradation
- Alert on significant changes to enable proactive model updates

**Pipeline Health Feedback**:  
- Report job completion status, resource utilisation, and other pipeline metrics
- Alert on failures, bottlenecks, and other operational issues

**Challenges and Considerations**:  
- Determining the right set of feedback metrics that balance insight and overhead
- Ensuring feedback is surfaced intuitively to relevant stakeholders
- Integrating feedback loops seamlessly into existing DevOps workflows
- Managing alert fatigue by prioritising the most critical notifications  

Following Norman's principle of making feedback "**immediate and informative**", these implementations enable timely issue resolution and maintain the reliability of Data Science and AI systems.

### 3. Constraints
In Data Science and AI systems, constraints prevent errors and ensure system integrity. By establishing clear boundaries, these implementations create guardrails that make systems more reliable and prevent catastrophic failures.

**Data Constraints**:  
- Enforce strict data schemas and types to catch invalid inputs  
- Implement input validation rules to filter out-of-bounds values
- Set min/max thresholds for acceptable feature ranges

**Model Constraints**:  
- Define resource usage limits to prevent model abuse
- Set prediction confidence thresholds to flag unreliable outputs
- Implement rate limiting for inference requests to manage load  

**Deployment Strategies**:  
- Blue-Green Deployment:  

```python
def deploy_model(new_model, old_model):
    # Deploy new model alongside old
    new_endpoint = deploy(new_model)
    # Route 10% traffic to new model
    route_traffic(new_endpoint, percentage=10)
    # Monitor for issues
    if monitor_health(new_endpoint, hours=24):
        route_traffic(new_endpoint, percentage=100)
    else:
        rollback(old_model)
```
- Canary Releases
- Shadow Testing (aka Shadowing Traffic)

**System Constraints**:  
- Versions control code, configurations, and model artefacts
- Lock production model weights to prevent unauthorised updates
- Enforce API contracts to maintain compatibility and reliability

**Data Privacy Framework**:  
- Implement data anonymisation:  

```python
# Example: Simple data anonymisation
def anonymise_data(df, sensitive_cols):
    for col in sensitive_cols:
        df[col] = df[col].apply(hash)
    return df
```

- Use differential privacy techniques
- Follow GDPR requirements
- Regular privacy audits

**Challenges and Considerations**:  
- Striking the right balance between strict constraints and flexibility
- Maintaining constraint definitions as the system evolves  
- Proactively identifying new failure modes that require new constraints
- Ensuring constraints are intuitive and not overly burdensome for users

Following Norman's principle that "**constraints guide behaviour and prevent errors**" these implementations create a robust, self-guarding Data Science and AI ecosystem.

### 4. Mappings
Clear mappings in Data and AI create logical relationships between different components. This improves maintainability, traceability, and alignment with business requirements.

**Code Mappings**:  
- Use consistent naming conventions for variables, functions, and modules
- Match code identifiers to relevant business concepts and data entities
- Structure code to reflect the end-to-end data transformation pipeline

**Data Mappings**:  
- Clearly link feature Engineering steps to source data characteristics  
- Map model outputs and predictions to relevant business metrics
- Maintain a transparent chain of data transformations

**System Mappings**:  
- Align pipeline stages and components with corresponding business logic
- Match API endpoints and data products to specific user personas and use cases
- Structure project repositories and directories to reflect the actual workflow

**Challenges and Considerations**:  
- Balancing the level of detail in mappings -overly prescriptive rules can hinder flexibility
- Keeping mappings up-to-date as the system evolves over time
- Ensuring mappings are intuitive and easily understood by all stakeholders
- Propagating mapping conventions across disparate Data Science and Engineering teams

By establishing "**logical and natural**" relationships, as advocated by Norman, these mapping implementations make complex AI systems more maintainable and accessible to a wider range of users.

### 5. Error Prevention and Recovery
In the Data Science and AI realm, robust error prevention and recovery mechanisms ensure overall system reliability and resilience.

**Prevention Mechanisms**:  
- Implement comprehensive automated testing for data, models, and pipelines
- Validate inputs and outputs against defined schemas and business rules
- Set up continuous integration checks to catch regressions early
- Monitor data distributions proactively to detect drift or anomalies

**Detection Systems**:  
- Track key model performance metrics like accuracy, latency, and throughput
- Monitor system resource utilisation including CPU, memory, and storage
- Alert on anomalous behaviour that deviates from established baselines
- Implement comprehensive error logging across the entire system

**Recovery Procedures**:  
- Version control all artefacts including code, data, and model checkpoints
- Implement seamless model rollback capabilities to revert to a known good state
- Maintain backup data pipelines and preprocessing logic for disaster recovery
- Create fallback prediction systems to serve traffic during outages

Each layer serves a specific purpose: prevention mechanisms stop errors before they occur, detection systems identify issues quickly, while recovery procedures ensure business continuity.

**Challenges and Considerations**:  
- Balancing the overhead of extensive error handling with overall system performance
- Determining the right set of metrics, thresholds, and alert rules for effective monitoring
- Ensuring recovery procedures are regularly tested and kept up-to-date
- Integrating error management seamlessly into existing DevOps workflows

Following Norman's principle that "**errors should be easy to detect and recover from**" these implementations create resilient Data Science and AI systems that can handle failures gracefully.


## Getting Started
To implement these principles effectively:

1. Start with Visibility and Feedback
- Begin with basic logging and monitoring
- Implement data validation
- Set up simple dashboards

2. Add Constraints and Mappings
- Implement schema validation
- Establish naming conventions
- Create basic API contracts

3. Build Error Prevention
- Add automated tests
- Implement rollback capabilities
- Create backup systems


## Conclusions
Norman's design principles, when properly implemented in Data Science and AI systems, create robust and maintainable solutions through:

- **Visibility**: Layered observability and model transparency
- **Feedback**: Real-time monitoring and issue detection
- **Constraints**: Data validation and resource limits
- **Mappings**: Consistent structure and clear relationships
- **Error Prevention**: Automated testing and recovery procedures

These create systems that are observable, self-monitoring, protected against failures, and maintainable.

Implementation Priority:
1. _Essential_: Visibility and Feedback
2. _Important_: Constraints and Mappings
3. _Advanced_: Error Prevention

When applied systematically, these principles create AI systems that are both technically sophisticated and sustainable in production.
