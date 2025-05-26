export default function AuthLayout({
    children,
  }: {
    children: React.ReactNode;
  }) {
    return (
      <div 
        className="min-h-screen flex items-center justify-center bg-cover bg-center py-12 px-4 sm:px-6 lg:px-8"
        style={{
          backgroundImage: "url('/images/login-background.jpg')",
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        {/* Overlay semitransparente */}
        <div className="absolute inset-0 bg-black/30 z-0"/>
        {children}
      </div>
    );
  }