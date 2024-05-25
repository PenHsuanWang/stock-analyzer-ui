import React, { useState } from 'react';
import LoadingIndicator from '../basic/LoadingIndicator';
import { runTest } from '../../services/api';  // Correctly import the runTest function

const TestModelPerformance = () => {
    const [testFile, setTestFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [testResults, setTestResults] = useState(null);

    const handleFileChange = (e) => {
        setTestFile(e.target.files[0]);
    };

    const handleRunTest = () => {
        setLoading(true);
        const formData = new FormData();
        formData.append('file', testFile);

        runTest(formData).then(results => {
            setTestResults(results);
            setLoading(false);
        }).catch(err => {
            setLoading(false);
            alert('Failed to run the test.');
        });
    };

    return (
        <div className="test-model-performance">
            <h2>Run Model on Test Data</h2>
            <input type="file" onChange={handleFileChange} />
            <button onClick={handleRunTest}>Run Test</button>
            {loading && <LoadingIndicator />}
            {testResults && (
                <div className="test-results">
                    {/* Display test results similar to MetricsComparison */}
                </div>
            )}
        </div>
    );
};

export default TestModelPerformance;
