const steps = ["Address", "Shipping", "Payment", "Confirmation"];

const CheckoutSteps = ({ current }) => {
    return (
        <div className="flex items-center justify-between mb-10 px-2 w-full max-w-[650px] mx-auto">
            {steps.map((label, i) => {
                const step = i + 1;
                const isCompleted = step < current;
                const isActive = step === current;

                return (
                    <div key={i} className="flex items-center flex-1">
                        <div className="flex flex-col items-center">
                            <div
                                className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold
                  ${isCompleted ? "bg-[#E7A01C] text-white" :
                                        isActive ? "bg-[#E7A01C] text-white" :
                                            "bg-gray-400 text-white"}`}
                            >
                                {isCompleted ? "✔" : step}
                            </div>
                            <span className={`text-sm mt-2
                ${isCompleted || isActive ? "text-[#011749] font-semibold" : "text-gray-500"}`}
                            >
                                {label}
                            </span>
                        </div>

                        {/* Connector Line */}
                        {i < steps.length - 1 && (
                            <div
                                className={`flex-1 h-[2px] mx-2
                  ${isCompleted ? "bg-[#E7A01C]" : "bg-gray-200"}`}
                            />
                        )}
                    </div>
                );
            })}
        </div>
    );
};

export default CheckoutSteps;
