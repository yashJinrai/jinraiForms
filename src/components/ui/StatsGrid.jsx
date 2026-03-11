const StatsGrid = ({ stats }) => (
    <div className="grid grid-cols-3 gap-8 mt-12 pt-12 border-t border-white/10">
        {stats.map((stat, i) => (
            <div key={i} className="text-center">
                <div className="text-white text-2xl font-bold">{stat.value}</div>
                <div className="text-white/60 text-sm">{stat.label}</div>
            </div>
        ))}
    </div>
)

export default StatsGrid
