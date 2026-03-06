const GlassPlaceholder = ({ className = "" }) => {
    return (
        <div className={`absolute z-0 pointer-events-none ${className}`}>
            {/* Glass Card */}
            <div className="relative w-[500px] h-[300px] lg:w-[700px] lg:h-[400px] rounded-3xl 
                      backdrop-blur-xl bg-white/5 
                      border border-white/10
                      shadow-[0_8px_32px_rgba(0,0,0,0.15)]
                      p-6">

                {/* Browser Dots */}
                <div className="flex gap-2 mb-6">
                    <div className="w-2 h-2 lg:w-3 lg:h-3 bg-white/20 rounded-full"></div>
                    <div className="w-2 h-2 lg:w-3 lg:h-3 bg-white/20 rounded-full"></div>
                    <div className="w-2 h-2 lg:w-3 lg:h-3 bg-white/20 rounded-full"></div>
                </div>

                {/* Top Bar */}
                <div className="h-3 lg:h-4 w-3/4 bg-white/10 rounded-full mb-8"></div>

                {/* Content Lines */}
                <div className="space-y-4">
                    <div className="h-4 lg:h-6 bg-white/10 rounded-lg w-full"></div>
                    <div className="h-4 lg:h-6 bg-white/10 rounded-lg w-5/6"></div>
                    <div className="h-4 lg:h-6 bg-white/10 rounded-lg w-4/6"></div>
                </div>
            </div>
        </div >
    );
};

export default GlassPlaceholder;
