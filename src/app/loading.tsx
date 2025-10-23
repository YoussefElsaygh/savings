export default function Loading() {
  return (
    <>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
          gap: "16px",
        }}
      >
        <div className="loading-spinner" />
        <p style={{ color: "#8c8c8c", fontSize: "14px" }}>Loading...</p>
      </div>

      <style
        dangerouslySetInnerHTML={{
          __html: `
          @keyframes spin {
            to {
              transform: rotate(360deg);
            }
          }
          .loading-spinner {
            width: 48px;
            height: 48px;
            border: 4px solid #f0f0f0;
            border-top-color: #000;
            border-radius: 50%;
            animation: spin 1s linear infinite;
          }
        `,
        }}
      />
    </>
  );
}
