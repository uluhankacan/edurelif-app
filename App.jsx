  // Extract React hooks from global window scope
const { useState } = React;

function EduReliefApp() {
  const [activeTab, setActiveTab] = useState("donor"); // 'donor' or 'student'
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [donationAmount, setDonationAmount] = useState(50);
  const [coverFees, setCoverFees] = useState(true);
  const [successMessage, setSuccessMessage] = useState("");

  // Initial Mock Students Data
  const [students, setStudents] = useState([
    {
      id: 1,
      name: "Jessica Taylor",
      school: "University of North Carolina",
      major: "Nursing (BSN)",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=200",
      totalDebt: 24500,
      raised: 18200,
      servicer: "Nelnet",
      story: "Working night shifts at the local clinic while finishing my nursing degree. This debt relief helps me step into my residency without heavy financial distress."
    },
    {
      id: 2,
      name: "Marcus Vance",
      school: "North Carolina A&T State University",
      major: "Mechanical Engineering",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200",
      totalDebt: 31000,
      raised: 12400,
      servicer: "MOHELA",
      story: "First-generation college student aiming to build sustainable energy solutions. Every contribution goes straight toward clearing my loan principal."
    }
  ]);

  // Student application state
  const [newStudentForm, setNewStudentForm] = useState({
    name: "",
    school: "",
    major: "",
    totalDebt: "",
    servicer: "Nelnet",
    story: ""
  });
  const [verificationStep, setVerificationStep] = useState(1);

  const handleDonate = (e) => {
    e.preventDefault();
    if (!selectedStudent) return;
   
    const stripeUrl = "https://buy.stripe.com/14A5kF53M83P4Xw0dkes";
    window.open(stripeUrl, "_blank");

    // ADD THIS LINE BACK IN:
    const amountNum = parseFloat(donationAmount);

    const updated = students.map(s => {
      if (s.id === selectedStudent.id) {
        return { ...s, raised: s.raised + amountNum };
      }
      return s;
    });
    setStudents(updated);
    setSuccessMessage(`Thank you! $${amountNum} was successfully sent directly to ${selectedStudent.servicer} on behalf of ${selectedStudent.name}.`);
    setTimeout(() => {
      setSuccessMessage("");
      setSelectedStudent(null);
    }, 4000);
  };

  const handleStudentSubmit = (e) => {
    e.preventDefault();
    const newEntry = {
      id: students.length + 1,
      name: newStudentForm.name || "Student Applicant",
      school: newStudentForm.school || "University",
      major: newStudentForm.major || "General Studies",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200",
      totalDebt: parseFloat(newStudentForm.totalDebt) || 15000,
      raised: 0,
      servicer: newStudentForm.servicer,
      story: newStudentForm.story || "Seeking direct community support to pay down my student loans."
    };
    setStudents([newEntry, ...students]);
    alert("Verification submitted successfully! Your campaign is now live on the platform.");
    setActiveTab("donor");
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      {/* Navigation Header */}
      <header className="bg-emerald-900 text-white shadow-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <span className="text-2xl font-black tracking-tight text-emerald-400">EduRelief</span>
            <span className="text-xs uppercase bg-emerald-800 px-2 py-0.5 rounded-full text-emerald-200 tracking-wider font-semibold">Direct Debt Pay</span>
          </div>
          <div className="flex bg-emerald-950 p-1 rounded-xl border border-emerald-800">
            <button
              onClick={() => setActiveTab("donor")}
              className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${activeTab === "donor" ? "bg-emerald-600 text-white shadow" : "text-emerald-300 hover:text-white"}`}
            >
              Donor Portal
            </button>
            <button
              onClick={() => setActiveTab("student")}
              className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-all ${activeTab === "student" ? "bg-emerald-600 text-white shadow" : "text-emerald-300 hover:text-white"}`}
            >
              Student Dashboard
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        {activeTab === "donor" ? (
          <div>
            <div className="mb-8 text-center max-w-2xl mx-auto">
              <h1 className="text-3xl font-extrabold text-slate-900 mb-2">Help Students Clear Their Debt</h1>
              <p className="text-slate-600">
                100% of your gift goes directly to verified student loan servicers (Nelnet, MOHELA, Aidvantage). No middlemen, zero personal bank transfers.
              </p>
            </div>
            {successMessage && (
              <div className="mb-6 p-4 bg-emerald-100 border border-emerald-400 text-emerald-800 rounded-xl text-center font-medium animate-fade-in">
                🎉 {successMessage}
              </div>
            )}
            <div className="grid md:grid-cols-2 gap-6">
              {students.map((student) => {
                const percent = Math.min(Math.round((student.raised / student.totalDebt) * 100), 100);
                return (
                  <div key={student.id} className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden flex flex-col justify-between hover:shadow-md transition">
                    <div className="p-6">
                      <div className="flex items-center space-x-4 mb-4">
                        <img src={student.avatar} alt={student.name} className="w-16 h-16 rounded-full object-cover border-2 border-emerald-500" />
                        <div>
                          <h3 className="font-bold text-lg text-slate-900">{student.name}</h3>
                          <p className="text-sm text-emerald-700 font-medium">{student.school}</p>
                          <p className="text-xs text-slate-500">Major: {student.major} • Servicer: <span className="font-semibold text-slate-700">{student.servicer}</span></p>
                        </div>
                      </div>
                      <p className="text-slate-600 text-sm mb-4 leading-relaxed">"{student.story}"</p>
                     
                      {/* Progress Bar */}
                      <div className="mb-2">
                        <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                          <span>Raised: ${student.raised.toLocaleString()}</span>
                          <span>Goal: ${student.totalDebt.toLocaleString()} ({percent}%)</span>
                        </div>
                        <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden">
                          <div className="bg-emerald-600 h-full rounded-full transition-all duration-500" style={{ width: `${percent}%` }}></div>
                        </div>
                      </div>
                    </div>
                    <div className="bg-slate-50 px-6 py-4 border-t border-slate-100 flex justify-between items-center">
                      <span className="text-xs font-semibold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
                        🔒 Verified Debt Account
                      </span>
                      <button
                        onClick={() => setSelectedStudent(student)}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-2 rounded-xl text-sm font-semibold shadow-sm transition"
                      >
                        Support This Student
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="max-w-xl mx-auto bg-white rounded-2xl shadow-sm border border-slate-200 p-8">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-slate-900">Student Verification & Campaign Setup</h2>
              <p className="text-sm text-slate-500">Complete the steps below to verify your academic status and link your student loan servicer.</p>
            </div>
            {verificationStep === 1 && (
              <form onSubmit={(e) => { e.preventDefault(); setVerificationStep(2); }} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Full Legal Name</label>
                  <input type="text" required placeholder="Jane Doe" className="w-full px-4 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    value={newStudentForm.name} onChange={e => setNewStudentForm({...newStudentForm, name: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">University / College (.edu)</label>
                  <input type="text" required placeholder="University name" className="w-full px-4 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    value={newStudentForm.school} onChange={e => setNewStudentForm({...newStudentForm, school: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Academic Major</label>
                  <input type="text" required placeholder="Computer Science" className="w-full px-4 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    value={newStudentForm.major} onChange={e => setNewStudentForm({...newStudentForm, major: e.target.value})} />
                </div>
                <button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 rounded-xl transition">
                  Next: Connect Loan Servicer &rarr;
                </button>
              </form>
            )}
            {verificationStep === 2 && (
              <form onSubmit={handleStudentSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Loan Servicer</label>
                  <select className="w-full px-4 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none bg-white"
                    value={newStudentForm.servicer} onChange={e => setNewStudentForm({...newStudentForm, servicer: e.target.value})}>
                    <option value="Nelnet">Nelnet</option>
                    <option value="MOHELA">MOHELA</option>
                    <option value="Aidvantage">Aidvantage</option>
                    <option value="EdFinancial">EdFinancial</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Total Outstanding Loan Balance ($)</label>
                  <input type="number" required placeholder="25000" className="w-full px-4 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    value={newStudentForm.totalDebt} onChange={e => setNewStudentForm({...newStudentForm, totalDebt: e.target.value})} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Your Personal Story / Bio</label>
                  <textarea rows="3" placeholder="Share why this relief matters to your future..." className="w-full px-4 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                    value={newStudentForm.story} onChange={e => setNewStudentForm({...newStudentForm, story: e.target.value})} />
                </div>
                <div className="flex space-x-3">
                  <button type="button" onClick={() => setVerificationStep(1)} className="w-1/3 bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold py-3 rounded-xl transition">
                    Back
                  </button>
                  <button type="submit" className="w-2/3 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-3 rounded-xl transition">
                    Launch Campaign
                  </button>
                </div>
              </form>
            )}
          </div>
        )}
      </main>

      {/* Donation Modal */}
      {selectedStudent && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl animate-scale-up">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-slate-900">Support {selectedStudent.name}</h3>
              <button onClick={() => setSelectedStudent(null)} className="text-slate-400 hover:text-slate-600 font-bold text-xl">&times;</button>
            </div>
            <p className="text-sm text-slate-600 mb-6">
              Funds are sent directly to <span className="font-semibold text-slate-800">{selectedStudent.servicer}</span> to reduce the principal loan balance.
            </p>
            <form onSubmit={handleDonate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Contribution Amount ($)</label>
                <div className="grid grid-cols-4 gap-2 mb-2">
                  {[25, 50, 100, 250].map((amt) => (
                    <button
                      type="button"
                      key={amt}
                      onClick={() => setDonationAmount(amt)}
                      className={`py-2 rounded-xl text-sm font-bold border transition ${donationAmount === amt ? "bg-emerald-600 text-white border-emerald-600 shadow" : "bg-white text-slate-700 border-slate-200 hover:border-emerald-400"}`}
                    >
                      ${amt}
                    </button>
                  ))}
                </div>
                <input
                  type="number"
                  min="5"
                  value={donationAmount}
                  onChange={(e) => setDonationAmount(e.target.value)}
                  className="w-full px-4 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                />
              </div>
              <div className="flex items-center space-x-2 py-2">
                <input
                  type="checkbox"
                  id="fees"
                  checked={coverFees}
                  onChange={(e) => setCoverFees(e.target.checked)}
                  className="w-4 h-4 text-emerald-600 rounded border-slate-300 focus:ring-emerald-500"
                />
                <label htmlFor="fees" className="text-xs text-slate-600">Cover 3% payment processing fee so 100% goes to the loan.</label>
              </div>
              <button
                type="submit"
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-xl shadow-md transition"
              >
                Pay Servicer Directly (${donationAmount})
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// Mount directly to DOM root
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<EduReliefApp />);
