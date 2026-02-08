// ============================================
// INTERACTIVE VISUALIZATIONS
// ============================================

document.addEventListener('DOMContentLoaded', () => {
    initSHAPChart();
    initConfusionMatrix();
    initROCPRCurves();
    initCorrelationMatrix();
    initEventListeners();
});

// ============================================
// SHAP FEATURE IMPORTANCE
// ============================================

function initSHAPChart() {
    updateSHAPChart('credit');
}

function updateSHAPChart(dataset) {
    const data = getSHAPData(dataset);
    
    const trace = {
        x: data.values,
        y: data.features,
        type: 'bar',
        orientation: 'h',
        marker: {
            color: data.values.map(v => v > 0 ? '#6366f1' : '#ef4444'),
            line: {
                color: '#1e293b',
                width: 1
            }
        },
        hovertemplate: '<b>%{y}</b><br>SHAP Value: %{x:.3f}<extra></extra>'
    };
    
    const layout = {
        title: {
            text: 'Feature Importance (SHAP Values)',
            font: { color: '#f1f5f9', size: 18 }
        },
        xaxis: {
            title: 'SHAP Value',
            gridcolor: '#334155',
            color: '#cbd5e1'
        },
        yaxis: {
            gridcolor: '#334155',
            color: '#cbd5e1'
        },
        plot_bgcolor: '#0f172a',
        paper_bgcolor: '#0f172a',
        font: { family: 'Inter, sans-serif', color: '#cbd5e1' },
        margin: { l: 150, r: 50, t: 50, b: 50 },
        height: 400
    };
    
    Plotly.newPlot('shapChart', [trace], layout, { responsive: true });
    
    // Update metrics
    document.getElementById('shapTopFeature').textContent = data.features[0];
    document.getElementById('shapMeanImpact').textContent = Math.abs(data.values[0]).toFixed(3);
    document.getElementById('shapNumFeatures').textContent = data.features.length;
}

function getSHAPData(dataset) {
    const datasets = {
        credit: {
            features: ['Debt-to-Income Ratio', 'Credit Score', 'Annual Income', 'Loan Amount', 
                      'Employment Length', 'Payment History', 'Credit Utilization', 'Recent Inquiries'],
            values: [0.285, -0.245, -0.198, 0.176, -0.142, -0.138, 0.125, 0.089]
        },
        churn: {
            features: ['Monthly Charges', 'Tenure', 'Contract Type', 'Tech Support', 
                      'Online Security', 'Total Charges', 'Internet Service', 'Payment Method'],
            values: [0.312, -0.287, -0.234, -0.198, -0.176, 0.154, 0.132, 0.098]
        },
        house: {
            features: ['Square Footage', 'Location Score', 'Year Built', 'Bedrooms', 
                      'Lot Size', 'Garage Spaces', 'School Rating', 'Crime Rate'],
            values: [0.425, 0.356, 0.287, 0.245, 0.198, 0.167, -0.145, 0.123]
        }
    };
    
    return datasets[dataset];
}

// ============================================
// CONFUSION MATRIX
// ============================================

function initConfusionMatrix() {
    updateConfusionMatrix('balanced', 2);
}

function updateConfusionMatrix(modelType, numClasses) {
    const data = getConfusionData(modelType, numClasses);
    
    const trace = {
        z: data.matrix,
        x: data.labels,
        y: data.labels,
        type: 'heatmap',
        colorscale: [
            [0, '#1e293b'],
            [0.5, '#6366f1'],
            [1, '#22d3ee']
        ],
        hovertemplate: 'Predicted: %{x}<br>Actual: %{y}<br>Count: %{z}<extra></extra>',
        showscale: true
    };
    
    const layout = {
        title: {
            text: 'Confusion Matrix',
            font: { color: '#f1f5f9', size: 18 }
        },
        xaxis: {
            title: 'Predicted Label',
            side: 'bottom',
            color: '#cbd5e1'
        },
        yaxis: {
            title: 'True Label',
            color: '#cbd5e1',
            autorange: 'reversed'
        },
        plot_bgcolor: '#0f172a',
        paper_bgcolor: '#0f172a',
        font: { family: 'Inter, sans-serif', color: '#cbd5e1' },
        height: 400
    };
    
    Plotly.newPlot('confusionMatrix', [trace], layout, { responsive: true });
    
    // Calculate and update metrics
    const metrics = calculateMetrics(data.matrix);
    document.getElementById('confusionAccuracy').textContent = (metrics.accuracy * 100).toFixed(1) + '%';
    document.getElementById('confusionPrecision').textContent = (metrics.precision * 100).toFixed(1) + '%';
    document.getElementById('confusionRecall').textContent = (metrics.recall * 100).toFixed(1) + '%';
    document.getElementById('confusionF1').textContent = metrics.f1.toFixed(3);
}

function getConfusionData(modelType, numClasses) {
    const classLabels = {
        2: ['Negative', 'Positive'],
        3: ['Class A', 'Class B', 'Class C'],
        5: ['Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5']
    };
    
    let matrix;
    
    if (numClasses === 2) {
        const matrices = {
            balanced: [[850, 150], [120, 880]],
            precision: [[920, 80], [200, 800]],
            recall: [[800, 200], [50, 950]]
        };
        matrix = matrices[modelType];
    } else if (numClasses === 3) {
        matrix = [
            [750, 120, 130],
            [90, 810, 100],
            [110, 95, 795]
        ];
    } else {
        matrix = [
            [680, 80, 70, 90, 80],
            [70, 720, 80, 70, 60],
            [90, 70, 750, 60, 30],
            [60, 80, 70, 700, 90],
            [80, 60, 50, 80, 730]
        ];
    }
    
    return {
        matrix: matrix,
        labels: classLabels[numClasses]
    };
}

function calculateMetrics(matrix) {
    // For binary classification (2x2 matrix)
    if (matrix.length === 2) {
        const tn = matrix[0][0];
        const fp = matrix[0][1];
        const fn = matrix[1][0];
        const tp = matrix[1][1];
        
        const accuracy = (tp + tn) / (tp + tn + fp + fn);
        const precision = tp / (tp + fp);
        const recall = tp / (tp + fn);
        const f1 = 2 * (precision * recall) / (precision + recall);
        
        return { accuracy, precision, recall, f1 };
    }
    
    // For multi-class, calculate macro-averaged metrics
    let totalAccuracy = 0;
    let totalPrecision = 0;
    let totalRecall = 0;
    
    const numClasses = matrix.length;
    let totalSamples = 0;
    let correctPredictions = 0;
    
    for (let i = 0; i < numClasses; i++) {
        for (let j = 0; j < numClasses; j++) {
            totalSamples += matrix[i][j];
            if (i === j) correctPredictions += matrix[i][j];
        }
    }
    
    totalAccuracy = correctPredictions / totalSamples;
    
    for (let i = 0; i < numClasses; i++) {
        let tp = matrix[i][i];
        let fp = 0, fn = 0;
        
        for (let j = 0; j < numClasses; j++) {
            if (j !== i) {
                fp += matrix[j][i];
                fn += matrix[i][j];
            }
        }
        
        const precision = tp / (tp + fp);
        const recall = tp / (tp + fn);
        
        totalPrecision += precision;
        totalRecall += recall;
    }
    
    const avgPrecision = totalPrecision / numClasses;
    const avgRecall = totalRecall / numClasses;
    const f1 = 2 * (avgPrecision * avgRecall) / (avgPrecision + avgRecall);
    
    return {
        accuracy: totalAccuracy,
        precision: avgPrecision,
        recall: avgRecall,
        f1: f1
    };
}

// ============================================
// ROC & PR CURVES
// ============================================

function initROCPRCurves() {
    updateROCPRCurves('balanced');
}

function updateROCPRCurves(dataset) {
    const data = getROCPRData(dataset);
    
    // ROC Curve
    const rocTrace1 = {
        x: data.roc.fpr,
        y: data.roc.tpr,
        type: 'scatter',
        mode: 'lines',
        name: 'ROC Curve',
        line: { color: '#6366f1', width: 3 },
        hovertemplate: 'FPR: %{x:.3f}<br>TPR: %{y:.3f}<extra></extra>'
    };
    
    const rocTrace2 = {
        x: [0, 1],
        y: [0, 1],
        type: 'scatter',
        mode: 'lines',
        name: 'Random Classifier',
        line: { color: '#64748b', width: 2, dash: 'dash' }
    };
    
    const rocLayout = {
        title: {
            text: `ROC Curve (AUC = ${data.roc.auc.toFixed(3)})`,
            font: { color: '#f1f5f9', size: 18 }
        },
        xaxis: {
            title: 'False Positive Rate',
            gridcolor: '#334155',
            color: '#cbd5e1',
            range: [0, 1]
        },
        yaxis: {
            title: 'True Positive Rate',
            gridcolor: '#334155',
            color: '#cbd5e1',
            range: [0, 1]
        },
        plot_bgcolor: '#0f172a',
        paper_bgcolor: '#0f172a',
        font: { family: 'Inter, sans-serif', color: '#cbd5e1' },
        showlegend: true,
        legend: { x: 0.6, y: 0.1 },
        height: 400
    };
    
    Plotly.newPlot('rocChart', [rocTrace1, rocTrace2], rocLayout, { responsive: true });
    
    // PR Curve
    const prTrace = {
        x: data.pr.recall,
        y: data.pr.precision,
        type: 'scatter',
        mode: 'lines',
        name: 'PR Curve',
        line: { color: '#22d3ee', width: 3 },
        hovertemplate: 'Recall: %{x:.3f}<br>Precision: %{y:.3f}<extra></extra>'
    };
    
    const prLayout = {
        title: {
            text: `Precision-Recall Curve (AUC = ${data.pr.auc.toFixed(3)})`,
            font: { color: '#f1f5f9', size: 18 }
        },
        xaxis: {
            title: 'Recall',
            gridcolor: '#334155',
            color: '#cbd5e1',
            range: [0, 1]
        },
        yaxis: {
            title: 'Precision',
            gridcolor: '#334155',
            color: '#cbd5e1',
            range: [0, 1]
        },
        plot_bgcolor: '#0f172a',
        paper_bgcolor: '#0f172a',
        font: { family: 'Inter, sans-serif', color: '#cbd5e1' },
        height: 400
    };
    
    Plotly.newPlot('prChart', [prTrace], prLayout, { responsive: true });
    
    // Update metrics
    document.getElementById('rocAUC').textContent = data.roc.auc.toFixed(3);
    document.getElementById('prAUC').textContent = data.pr.auc.toFixed(3);
    document.getElementById('optimalThreshold').textContent = data.optimalThreshold.toFixed(3);
}

function getROCPRData(dataset) {
    const datasets = {
        balanced: {
            roc: {
                fpr: [0, 0.02, 0.05, 0.08, 0.12, 0.18, 0.25, 0.35, 0.50, 0.70, 1.0],
                tpr: [0, 0.45, 0.70, 0.82, 0.88, 0.92, 0.95, 0.97, 0.98, 0.99, 1.0],
                auc: 0.945
            },
            pr: {
                recall: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0],
                precision: [1.0, 0.98, 0.96, 0.94, 0.92, 0.90, 0.87, 0.83, 0.78, 0.70, 0.50],
                auc: 0.918
            },
            optimalThreshold: 0.524
        },
        imbalanced: {
            roc: {
                fpr: [0, 0.02, 0.05, 0.10, 0.15, 0.22, 0.30, 0.42, 0.60, 0.80, 1.0],
                tpr: [0, 0.35, 0.60, 0.75, 0.83, 0.88, 0.92, 0.95, 0.97, 0.99, 1.0],
                auc: 0.915
            },
            pr: {
                recall: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0],
                precision: [0.90, 0.85, 0.78, 0.70, 0.62, 0.54, 0.46, 0.38, 0.30, 0.22, 0.10],
                auc: 0.632
            },
            optimalThreshold: 0.315
        },
        severe: {
            roc: {
                fpr: [0, 0.01, 0.03, 0.07, 0.12, 0.20, 0.30, 0.45, 0.65, 0.85, 1.0],
                tpr: [0, 0.25, 0.50, 0.68, 0.78, 0.85, 0.90, 0.94, 0.97, 0.99, 1.0],
                auc: 0.885
            },
            pr: {
                recall: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0],
                precision: [0.50, 0.42, 0.35, 0.28, 0.22, 0.17, 0.13, 0.10, 0.07, 0.04, 0.01],
                auc: 0.258
            },
            optimalThreshold: 0.125
        }
    };
    
    return datasets[dataset];
}

// ============================================
// CORRELATION MATRIX
// ============================================

function initCorrelationMatrix() {
    const features = ['Feature 1', 'Feature 2', 'Feature 3', 'Feature 4', 'Feature 5', 
                     'Feature 6', 'Feature 7', 'Feature 8'];
    
    // Generate correlation matrix
    const matrix = [
        [1.00, 0.85, -0.12, 0.34, -0.08, 0.45, -0.23, 0.17],
        [0.85, 1.00, -0.18, 0.28, -0.15, 0.52, -0.31, 0.09],
        [-0.12, -0.18, 1.00, -0.45, 0.67, -0.23, 0.78, -0.34],
        [0.34, 0.28, -0.45, 1.00, -0.56, 0.19, -0.38, 0.42],
        [-0.08, -0.15, 0.67, -0.56, 1.00, -0.12, 0.73, -0.28],
        [0.45, 0.52, -0.23, 0.19, -0.12, 1.00, -0.29, 0.15],
        [-0.23, -0.31, 0.78, -0.38, 0.73, -0.29, 1.00, -0.41],
        [0.17, 0.09, -0.34, 0.42, -0.28, 0.15, -0.41, 1.00]
    ];
    
    const trace = {
        z: matrix,
        x: features,
        y: features,
        type: 'heatmap',
        colorscale: [
            [0, '#ef4444'],
            [0.5, '#0f172a'],
            [1, '#22d3ee']
        ],
        hovertemplate: '%{y} vs %{x}<br>Correlation: %{z:.2f}<extra></extra>',
        showscale: true,
        zmin: -1,
        zmax: 1
    };
    
    const layout = {
        title: {
            text: 'Feature Correlation Matrix',
            font: { color: '#f1f5f9', size: 18 }
        },
        xaxis: {
            side: 'bottom',
            color: '#cbd5e1'
        },
        yaxis: {
            color: '#cbd5e1',
            autorange: 'reversed'
        },
        plot_bgcolor: '#0f172a',
        paper_bgcolor: '#0f172a',
        font: { family: 'Inter, sans-serif', color: '#cbd5e1' },
        height: 500
    };
    
    Plotly.newPlot('correlationMatrix', [trace], layout, { responsive: true });
}

// ============================================
// EVENT LISTENERS
// ============================================

function initEventListeners() {
    document.getElementById('shapDataset')?.addEventListener('change', (e) => {
        updateSHAPChart(e.target.value);
    });
    
    document.getElementById('confusionModel')?.addEventListener('change', (e) => {
        const numClasses = parseInt(document.getElementById('confusionClasses').value);
        updateConfusionMatrix(e.target.value, numClasses);
    });
    
    document.getElementById('confusionClasses')?.addEventListener('change', (e) => {
        const modelType = document.getElementById('confusionModel').value;
        updateConfusionMatrix(modelType, parseInt(e.target.value));
    });
    
    document.getElementById('rocDataset')?.addEventListener('change', (e) => {
        updateROCPRCurves(e.target.value);
    });
}
