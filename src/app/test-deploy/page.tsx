export default function TestPage() {
    return (
        <div style={{ padding: '2rem', textAlign: 'center' }}>
            <h1>Test Page - Deployment Working!</h1>
            <p>If you can see this, the deployment is successful.</p>
            <p>Current time: {new Date().toISOString()}</p>
        </div>
    );
}
