import { ArrowUpIcon, ArrowDownIcon, MinusIcon } from 'lucide-react';

export default function WorkoutComparison({ comparisonData }) {
    if (!comparisonData || comparisonData.message) return <p className="text-gray-400">Not enough data to compare.</p>;

    const { weightDiff, volumeDiff } = comparisonData;

    const renderDiff = (value, unit) => {
        if (value > 0) {
            return <span className="text-emerald-400 flex items-center text-sm font-medium"><ArrowUpIcon size={14} className="mr-1"/> {value} {unit}</span>;
        } else if (value < 0) {
            return <span className="text-rose-400 flex items-center text-sm font-medium"><ArrowDownIcon size={14} className="mr-1"/> {Math.abs(value)} {unit}</span>;
        }
        return <span className="text-slate-400 flex items-center text-sm font-medium"><MinusIcon size={14} className="mr-1"/> No change</span>;
    };

    return (
        <div className="bg-slate-900 rounded-xl p-5 border border-slate-800 flex justify-between items-center">
            <div>
                <p className="text-slate-400 text-sm font-medium">Compared to last session</p>
                <h4 className="text-white text-lg font-bold mt-1">Weight</h4>
                <div className="mt-1">{renderDiff(weightDiff, 'kg')}</div>
            </div>
            
            <div className="text-right">
                <h4 className="text-white text-lg font-bold mt-1">Total Volume</h4>
                <div className="mt-1 justify-end flex">{renderDiff(volumeDiff, 'kg')}</div>
            </div>
        </div>
    );
}
