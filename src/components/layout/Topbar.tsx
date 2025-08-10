const Topbar = () => {
  return (
    <header className="h-14 border-b bg-background/60 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-30">
      <div className="container h-full flex items-center justify-between">
        <h2 className="text-sm font-medium text-muted-foreground">Pharmacy Management System</h2>
        <div className="text-xs text-muted-foreground">Sprint 1 • UI scaffold</div>
      </div>
    </header>
  );
};

export default Topbar;
