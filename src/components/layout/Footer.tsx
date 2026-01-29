export function Footer() {
    return (
        <footer className="border-t border-border/40 bg-background/80 backdrop-blur-xl py-8">
            <div className="mx-auto max-w-7xl px-4 md:px-8">
                <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-2">
                        <div className="h-6 w-6 rounded-lg bg-primary flex items-center justify-center text-[10px] font-black text-white">L</div>
                        <p className="text-xs font-black text-foreground tracking-widest uppercase">
                            LOLLY <span className="text-primary tracking-tighter">PLATFORM</span>
                        </p>
                    </div>
                    <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest">
                        © {new Date().getFullYear()} LOLLY Corp • L'excellence Stratégique
                    </p>
                    <div className="flex items-center gap-8">
                        {["Conditions", "Confidentialité", "Support"].map((item) => (
                            <a key={item} href="#" className="text-[10px] font-black text-muted-foreground hover:text-primary transition-all uppercase tracking-widest">
                                {item}
                            </a>
                        ))}
                    </div>
                </div>
            </div>
        </footer>
    );
}
