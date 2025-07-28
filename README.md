# Accident_prediction

Accident Prediction – Traffic Accident Severity Prediction using Machine Learning
Overview: Traffic accidents are a major concern worldwide, leading to injuries, fatalities, and property damage. This project focuses on predicting the severity of traffic accidents—categorized as Low, Moderate, or High—based on historical traffic and environmental factors like time of day, weather conditions, and road conditions. By applying machine learning techniques, this project analyzes accident patterns and generates insights that can assist traffic authorities and policymakers in minimizing accident risks, improving traffic management, and enhancing road safety strategies.



Objectives
           Analyze traffic accident data to understand factors influencing accident severity.
           Build and train machine learning models to classify accident severity (Low/Moderate/High).
           Create visualizations to better interpret data trends and present findings.
           Provide a foundation for future real-time accident prediction systems and potential integration with road safety monitoring applications.

Dataset
        File: dataset_traffic_accident_prediction1.csv (Kaggle)
        Features: Time of day, road conditions, weather, traffic volume, etc.
        Target Variable: Accident_Severity
        Encoded as 0 = Low, 1 = Moderate, 2 = High.

Data Cleaning:
        Removal of irrelevant fields (Driver_Age, Driver_Experience) to avoid bias.
        Handling missing values with median imputation.
        Encoding categorical values for machine learning compatibility.



Technologies Used
        Language: Python
        Libraries: Pandas, NumPy, Scikit-learn, XGBoost, Matplotlib, Seaborn
        Development Tools: Jupyter Notebook, VS Code


Data Preprocessing
        Data preprocessing ensures the dataset is clean, consistent, and suitable for machine learning.

       Steps Involved:
          Removal of Irrelevant Columns: Removed columns like Driver_Age and Driver_Experience as they are not directly related to accident conditions.
          Encoding: Converted Accident_Severity into numeric form (0, 1, 2). Encoded other categorical variables such as Time_of_Day using label encoding.
          Handling Missing Values: Filled missing numerical values with median to avoid the effect of outliers.
          Balancing the Dataset: Accident data often contains more “Low” severity cases than “High” severity. Resampling was applied to ensure fair training for all severity levels.

<img width="1024" height="1024" alt="image" src="https://github.com/user-attachments/assets/72c512d6-695c-4683-9b64-d3f7e3e1c10b" />



Visualizations: Visualizations help interpret data and reveal patterns useful for modeling and decision-making.

1. Count of Accidents by Time of Day
Shows accident frequency across different times (morning, afternoon, evening, night) to identify peak accident periods.

<img width="975" height="600" alt="image" src="https://github.com/user-attachments/assets/b1fc2797-7591-406e-b8ab-d15c5c5565c7" />



2. Severity Distribution Graphs- Pie chart
Displays the distribution of accidents across Low, Moderate, and High severity levels. Useful for understanding dataset imbalance.

<img width="717" height="675" alt="image" src="https://github.com/user-attachments/assets/15da45dc-f20f-4c3e-8720-26c0b9c6dfa3" />




3. Correlation Heatmaps (Optional)
Visualizes relationships between features and accident severity to identify key contributing factors.

<img width="1144" height="728" alt="image" src="https://github.com/user-attachments/assets/dd2489e1-737b-4e2f-b0d1-77970b194221" />



Models Implemented
      Three machine learning algorithms were implemented and compared:

Random Forest Classifier:  Ensemble method that combines multiple decision trees for robust predictions.

Logistic Regression: Baseline linear classifier to predict accident severity probabilities.

XGBoost Classifier:  Gradient boosting algorithm optimized for high accuracy and performance.


                        
Model Comparison Graph
<img width="973" height="590" alt="image" src="https://github.com/user-attachments/assets/db545315-34b7-475a-bc20-00fa1ece4fbe" />


Results

       Predicted accident severity with high accuracy using Random Forest and XGBoost.
       Accuracy and evaluation metrics (precision, recall, F1-score) were used for performance comparison.
       Visualizations provided actionable insights, e.g., most accidents occur during evening hours.


<img width="409" height="183" alt="image" src="https://github.com/user-attachments/assets/dfd92b08-eaa6-4b96-9465-85ce91152a66" />

