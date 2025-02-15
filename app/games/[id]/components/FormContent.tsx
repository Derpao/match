interface FormContentProps {
  teamNames: {
    teamA: string;
    teamB: string;
  };
  scoreA: string;
  scoreB: string;
  phoneNumber: string;
  isPredictionAllowed: boolean;
  isSubmitting: boolean;
  error: string;
  closingTime: string;
  onScoreAChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onScoreBChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onPhoneChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
}

export default function FormContent({
  teamNames,
  scoreA,
  scoreB,
  phoneNumber,
  isPredictionAllowed,
  isSubmitting,
  error,
  closingTime,
  onScoreAChange,
  onScoreBChange,
  onPhoneChange,
  onSubmit
}: FormContentProps) {
  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4">
      {!isPredictionAllowed && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
          <p className="text-red-600 text-sm text-center">
            ไม่สามารถทายผลได้ เนื่องจากต้องทำนายก่อนเวลา {closingTime}
          </p>
        </div>
      )}

      <div className="flex items-center justify-between gap-3">
        <label className="block flex-1">
          <span className="text-gray-700 text-sm mb-1 block text-center">{teamNames.teamA}</span>
          <input
            type="number"
            min="0"
            max="99"
            required
            value={scoreA}
            onChange={onScoreAChange}
            className="w-full h-12 text-center text-xl font-bold rounded-lg border border-gray-200 bg-white text-black"
          />
        </label>
        <span className="font-bold text-gray-700 text-lg">VS</span>
        <label className="block flex-1">
          <span className="text-gray-700 text-sm mb-1 block text-center">{teamNames.teamB}</span>
          <input
            type="number"
            min="0"
            max="99"
            required
            value={scoreB}
            onChange={onScoreBChange}
            className="w-full h-12 text-center text-xl font-bold rounded-lg border border-gray-200 bg-white text-black"
          />
        </label>
      </div>

      <label className="block">
        <span className="text-gray-700 text-sm mb-1 block">เบอร์โทรศัพท์</span>
        <input
          type="tel"
          required
          value={phoneNumber}
          onChange={onPhoneChange}
          className="w-full h-12 px-3 rounded-lg border border-gray-200 bg-white text-black text-base"
        />
      </label>

      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

      <button 
        type="submit"
        disabled={isSubmitting || !isPredictionAllowed}
        className="h-12 mt-2 bg-blue-600 text-white rounded-lg text-base font-medium 
                 disabled:bg-gray-400 disabled:cursor-not-allowed active:bg-blue-700"
      >
        {isSubmitting 
          ? 'กำลังบันทึก...' 
          : !isPredictionAllowed 
            ? 'หมดเวลาทำนายผล'
            : 'ยืนยันการทาย'
        }
      </button>
    </form>
  );
}
