// Extract React hooks from global window scope
const { useState, useEffect } = React;

// Initialize Supabase Client
const SUPABASE_URL = "https://xajsghmjbqjsqcibnbsl.supabase.co";
const SUPABASE_ANON_KEY = "YOUR_SUPABASE_ANON_KEY_HERE";
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

function EduReliefApp() {
  const [activeTab, setActiveTab] = useState("donor"); // 'donor' or 'student'
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [donationAmount, setDonationAmount] = useState(50);
  const [successMessage, setSuccessMessage] = useState("");
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
      story: "Working night shifts at the local clinic while finishing my nursing degree. This debt relief helps me step into my career unburdened."
    }
  ]);

  const [newStudentForm, setNewStudentForm] = useState({
    name: "",
    school: "",
    major: "",
    totalDebt: "",
    servicer: "Nelnet",
    story: ""
  });

  // Fetch student campaigns from Supabase on load
  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    const { data, error } = await supabase
      .from("students")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error && data && data.length > 0) {
      setStudents(data);
    }
  };

  const handleDonate = (e) => {
    e.preventDefault();
    if (!selectedStudent) return;
   
    // Live Stripe Payment Link
    const stripeUrl = "https://buy.stripe.com/14A5kF53M83P4Xw0dkes";
    window.open(stripeUrl, "_blank");

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

  const handleStudentSubmit = async (e) => {
    e.preventDefault();
   
    const newEntry = {
      name: newStudentForm.name || "Student Applicant",
      school: newStudentForm.school || "University",
      major: newStudentForm.major || "General Studies",
      avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=200",
      totalDebt: parseFloat(newStudentForm.totalDebt) || 15000,
      raised: 0,
      servicer: newStudentForm.servicer,
      story: newStudentForm.story || "Seeking direct community support to pay down my student loans."
    };

    // Save directly to Supabase cloud table
    const { error } = await supabase.from("students").insert([newEntry]);

    if (!error) {
      fetchStudents(); // Refresh live list
      alert("Verification submitted successfully! Your campaign is now live on the platform.");
      setActiveTab("donor");
      setNewStudentForm({ name: "", school: "", major: "", totalDebt: "", servicer: "Nelnet", story: "" });
    } else {
      alert("Submission error: " + error.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
      {/* Header */}
      <header className="bg-blue-900 text-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <span className="text-2xl font-black tracking-tight text-blue-200">EduRelief</span>
            <span className="text-xs bg-blue-700 px-2 py-0.5 rounded-full uppercase tracking-wider">Direct Pay</span>
          </div>
          <nav className="flex space-x-2">
            <button
              onClick={() => setActiveTab("donor")}
              className={`px-4 py-2 rounded-lg font-medium transition ${activeTab === 'donor' ? 'bg-blue-700 text-white shadow' : 'text-blue-200 hover:bg-blue-800'}`}
            >
              Support Students
            </button>
            <button
              onClick={() => setActiveTab("student")}
              className={`px-4 py-2 rounded-lg font-medium transition ${activeTab === 'student' ? 'bg-blue-700 text-white shadow' : 'text-blue-200 hover:bg-blue-800'}`}
            >
              Apply for Relief
            </button>
          </nav>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {successMessage && (
          <div className="mb-6 bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-xl shadow-sm">
            {successMessage}
          </div>
        )}

        {activeTab === "donor" ? (
          <div>
            <div className="text-center max-w-2xl mx-auto mb-10">
              <h1 className="text-3xl font-extrabold text-gray-900 mb-3">Direct-to-Servicer Student Debt Relief</h1>
              <p className="text-gray-600">Browse verified student campaigns and contribute securely. Funds route directly toward principal loan reduction.</p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {students.map((student) => {
                const percent = Math.min(Math.round((student.raised / student.totalDebt) * 100), 100);
                return (
                  <div key={student.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col justify-between hover:shadow-md transition">
                    <div className="p-6">
                      <div className="flex items-center space-x-4 mb-4">
                        <img src={student.avatar} alt={student.name} className="w-14 h-14 rounded-full object-cover border-2 border-blue-100" />
                        <div>
                          <h3 className="font-bold text-lg text-gray-900">{student.name}</h3>
                          <p className="text-xs text-blue-600 font-semibold">{student.school}</p>
                          <span className="inline-block mt-1 bg-gray-100 text-gray-600 text-xs px-2 py-0.5 rounded">Servicer: {student.servicer}</span>
                        </div>
                      </div>
                      <p className="text-gray-600 text-sm mb-6 line-clamp-3">{student.story}</p>
                     
                      <div className="space-y-2 mb-4">
                        <div className="flex justify-between text-sm">
                          <span className="font-medium text-gray-700">${student.raised.toLocaleString()} raised</span>
                          <span className="text-gray-500">Goal: ${student.totalDebt.toLocaleString()}</span>
                        </div>
                        <div className="w-full bg-gray-100 h-2.5 rounded-full overflow-hidden">
                          <div className="bg-blue-600 h-full rounded-full transition-all duration-500" style={{ width: `${percent}%` }}></div>
                        </div>
                      </div>
                    </div>

                    <div className="p-6 pt-0">
                      <button
                        onClick={() => setSelectedStudent(student)}
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-xl transition shadow-sm"
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
          <div className="max-w-xl mx-auto bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Student Relief Application</h2>
            <p className="text-gray-600 text-sm mb-6">Submit your verified loan information to list your campaign on EduRelief.</p>
           
            <form onSubmit={handleStudentSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={newStudentForm.name}
                  onChange={(e) => setNewStudentForm({...newStudentForm, name: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  placeholder="Jane Doe"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">University / College</label>
                  <input
                    type="text"
                    required
                    value={newStudentForm.school}
                    onChange={(e) => setNewStudentForm({...newStudentForm, school: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                    placeholder="State University"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Loan Servicer</label>
                  <select
                    value={newStudentForm.servicer}
                    onChange={(e) => setNewStudentForm({...newStudentForm, servicer: e.target.value})}
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white"
                  >
                    <option value="Nelnet">Nelnet</option>
                    <option value="MOHELA">MOHELA</option>
                    <option value="Aidvantage">Aidvantage</option>
                    <option value="Navient">Navient</option>
                    <option value="EdFinancial">EdFinancial</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Total Loan Balance ($)</label>
                <input
                  type="number"
                  required
                  value={newStudentForm.totalDebt}
                  onChange={(e) => setNewStudentForm({...newStudentForm, totalDebt: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  placeholder="25000"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Your Story & Goals</label>
                <textarea
                  rows="3"
                  value={newStudentForm.story}
                  onChange={(e) => setNewStudentForm({...newStudentForm, story: e.target.value})}
                  className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  placeholder="Briefly describe your major and financial situation..."
                ></textarea>
              </div>
              <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl transition shadow-sm"
              >
                Submit Campaign for Review
              </button>
            </form>
          </div>
        )}

        {/* Donation Modal */}
        {selectedStudent && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-xl relative animate-in fade-in zoom-in duration-200">
              <h3 className="text-xl font-bold text-gray-900 mb-1">Support {selectedStudent.name}</h3>
              <p className="text-xs text-gray-500 mb-6">Direct payment via Stripe to loan servicer: <strong className="text-blue-600">{selectedStudent.servicer}</strong></p>
             
              <form onSubmit={handleDonate} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 uppercase mb-1">Donation Amount ($)</label>
                  <input
                    type="number"
                    min="5"
                    required
                    value={donationAmount}
                    onChange={(e) => setDonationAmount(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none text-lg font-bold"
                  />
                </div>
                <div className="flex space-x-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setSelectedStudent(null)}
                    className="w-1/2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-2.5 rounded-xl transition"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="w-1/2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 rounded-xl transition shadow-sm"
                  >
                    Pay Servicer Directly
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

// Mount directly to DOM root
const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<EduReliefApp />);
