document.addEventListener("DOMContentLoaded", function () {
    // ===========================
    // STUDENT REGISTRATION FORM
    // ===========================
    const registerForm = document.getElementById("register_form");

    if (registerForm) {
        registerForm.addEventListener("submit", function (event) {
            event.preventDefault(); // Prevent form from reloading

            const admNo = document.getElementById("adm_no").value.trim();
            const studentName = document.getElementById("student_name").value.trim();
            const gender = document.getElementById("gender").value;
            const password = document.getElementById("password").value;

            if (!admNo || !studentName || !gender || !password) {
                alert("Please fill in all fields.");
                return;
            }

            if (localStorage.getItem(admNo)) {
                alert("Admission number already registered! Please log in.");
                return;
            }

            // Store student details in local storage
            const user = { admNo, studentName, gender, password };
            localStorage.setItem(admNo, JSON.stringify(user));

            alert("Registration successful! You can now log in.");
            registerForm.reset();
        });
    }

    // ===========================
    // STUDENT LOGIN FUNCTIONALITY
    // ===========================
    const loginForm = document.getElementById("login_form");

    if (loginForm) {
        loginForm.addEventListener("submit", function (event) {
            event.preventDefault();
    
            const admNo = document.getElementById("adm_no").value.trim();
            const password = document.getElementById("password").value.trim();
    
            if (!admNo || !password) {
                alert("Please enter both admission number and password.");
                return;
            }
    
            const storedUser = localStorage.getItem(admNo);
            if (!storedUser) {
                alert("No account found with this admission number. Please register.");
                return;
            }
    
            const user = JSON.parse(storedUser);
            if (user.password !== password) {
                alert("Incorrect password. Please try again.");
                return;
            }
    
            // Store the current user session
            localStorage.setItem("currentUser", admNo);  
    
            alert("Login successful! Redirecting to the dashboard...");
            window.location.href = "form3.html"; // Redirect to the voting page
        });
    }
document.addEventListener("DOMContentLoaded", function () {
    const deleteForm = document.getElementById("delete_form");

    if (deleteForm) {
        deleteForm.addEventListener("submit", function (event) {
            event.preventDefault(); // Prevent form from reloading

            const admNoToDelete = document.getElementById("delete_adm_no").value.trim();

            if (!admNoToDelete) {
                alert("Please enter an admission number to delete.");
                return;
            }

            const storedUser = localStorage.getItem(admNoToDelete);

            if (!storedUser) {
                alert("No student found with this admission number.");
                return;
            }

            // Remove the student record from local storage
            localStorage.removeItem(admNoToDelete);

            alert("Student record deleted successfully!");
            deleteForm.reset();

            // Optionally refresh the student list table
            if (studentsTableBody) {
                studentsTableBody.innerHTML = ""; // Clear the table

                // Retrieve updated student list
                let students = [];

                for (let i = 0; i < localStorage.length; i++) {
                    let key = localStorage.key(i);
                    let studentData = JSON.parse(localStorage.getItem(key));

                    // Ensure key belongs to a student object
                    if (studentData && studentData.admNo && studentData.studentName && studentData.gender) {
                        students.push(studentData);
                    }
                }

                // Populate table with updated data
                if (students.length === 0) {
                    studentsTableBody.innerHTML = "<tr><td colspan='3'>No students registered yet.</td></tr>";
                } else {
                    students.forEach(student => {
                        let row = `
                            <tr>
                                <td>${student.admNo}</td>
                                <td>${student.studentName}</td>
                                <td>${student.gender}</td>
                            </tr>
                        `;
                        studentsTableBody.innerHTML += row;
                    });
                }
            }
        });
    }
});
    
    // ===========================
    // VOTING FUNCTIONALITY
    // ===========================
    const votingForm = document.getElementById("voting_form");

    if (votingForm) {
        const admNo = localStorage.getItem("currentUser"); // Get logged-in user
        if (!admNo) {
            alert("You must log in to vote!");
            window.location.href = "form2.html"; // Redirect to login
            return;
        }
    
        const hasVoted = localStorage.getItem(`hasVoted_${admNo}`);
    
        if (hasVoted === "true") {
            const radioButtons = document.querySelectorAll("input[name='candidate']");
            radioButtons.forEach(radio => {
                radio.disabled = true;
            });
            alert("You have already voted!");
        }
    
        votingForm.addEventListener("submit", function (event) {
            event.preventDefault();
    
            const selectedCandidate = document.querySelector("input[name='candidate']:checked");
            if (!selectedCandidate) {
                alert("Please select a candidate before voting.SCHOOL PRESIDENT");
                return;
            }
    
            const candidateName = selectedCandidate.value;
            let votes = JSON.parse(localStorage.getItem("votes")) || { James: 0, Alice: 0, David: 0 };
    
            votes[candidateName]++;
            localStorage.setItem("votes", JSON.stringify(votes));
    
            localStorage.setItem(`hasVoted_${admNo}`, "true");
    
            const radioButtons = document.querySelectorAll("input[name='candidate']");
            radioButtons.forEach(radio => {
                radio.disabled = true;
            });
    
            alert("Vote recorded successfully!");
            votingForm.reset();
        });
    }
    
    // ===========================
    // VIEW RESULTS FUNCTIONALITY
    // ===========================
    const resultBtn = document.getElementById("result");

    if (resultBtn) {
        resultBtn.addEventListener("click", function (event) {
            event.preventDefault();

            const storedVotes = localStorage.getItem("votes");

            if (!storedVotes) {
                alert("No results available.");
                return;
            }

            const votes = JSON.parse(storedVotes);
            let resultsMessage = "Election Results:\n";

            for (const candidate in votes) {
                resultsMessage += `${candidate}: ${votes[candidate]} votes\n`;
            }

            const maxVotes = Math.max(...Object.values(votes));
            const winners = Object.keys(votes).filter(candidate => votes[candidate] === maxVotes);

            resultsMessage += `\nWinner: ${winners.join(", ")}`;
            alert(resultsMessage);
        });
    }

    // ===========================
    // ADMIN LOGIN FUNCTIONALITY
    // ===========================
    const adminLoginForm = document.getElementById("admin_login_form");

    if (adminLoginForm) {
        adminLoginForm.addEventListener("submit", function (event) {
            event.preventDefault();

            const username = document.getElementById("username").value.trim();
            const password = document.getElementById("password").value.trim();

            if (username === "admin" && password === "admin") {
                alert("Login successful!");
                window.location.href = "admin_login.html"; // Redirect to admin panel
            } else {
                alert("Invalid username or password. Try again.");
            }
        });
    }

    // ===========================
    // LOGOUT FUNCTIONALITY
    // ===========================
    const logoutBtn = document.getElementById("logout_btn");

    if (logoutBtn) {
        logoutBtn.addEventListener("click", function () {
            window.location.href = "index.html"; // Redirect to main menu
        });
    }
});



const studentsTableBody = document.querySelector("#students_table tbody");

if (studentsTableBody) {
    studentsTableBody.innerHTML = ""; // Clear any existing data

    // Retrieve students from local storage
    let students = [];

    // Loop through local storage keys and collect student data
    for (let i = 0; i < localStorage.length; i++) {
        let key = localStorage.key(i);
        let studentData = JSON.parse(localStorage.getItem(key));

        // Ensure the key belongs to a student object (avoiding non-student data)
        if (studentData && studentData.admNo && studentData.studentName && studentData.gender) {
            students.push(studentData);
        }
    }

    // Check if students exist
    if (students.length === 0) {
        studentsTableBody.innerHTML = "<tr><td colspan='3'>No students registered yet.</td></tr>";
    } else {
        // Populate table with student data
        students.forEach(student => {
            let row = `
                <tr>
                    <td>${student.admNo}</td>
                    <td>${student.studentName}</td>
                    <td>${student.gender}</td>
                </tr>
            `;
            studentsTableBody.innerHTML += row;
        });
    }
}





document.addEventListener("DOMContentLoaded", function () {
    const exitBtn = document.getElementById("welcome_btn");

    if (exitBtn) {
        exitBtn.addEventListener("click", function (event) {
            event.preventDefault(); // Prevent default link behavior
            
            const confirmExit = confirm("Are you sure you want to exit?");
            
            if (confirmExit) {
                // Clear session storage (logs out the user)
                sessionStorage.clear();
                
                // Redirect to a goodbye page or homepage (modify as needed)
                window.location.href = "https://www.google.com/"; 
                
                // Optionally, close the tab (only works in some cases)
                // window.close();
            }
        });
    }
});
document.addEventListener("DOMContentLoaded", function() {
    // Function to delete a student by admission number
    function deleteStudent(admNo) {
        // Check if student exists
        if (!localStorage.getItem(admNo)) {
            alert("Student with admission number " + admNo + " not found!");
            return false;
        }

        // Confirm deletion
        if (!confirm("Are you sure you want to delete student " + admNo + "?")) {
            return false;
        }

        // Remove from localStorage
        localStorage.removeItem(admNo);
        return true;
    }

    // Function to refresh the student list table
    function refreshStudentTable() {
        const tableBody = document.querySelector("#studentsTable tbody");
        if (!tableBody) return;

        tableBody.innerHTML = ""; // Clear existing rows

        // Get all students from localStorage
        const students = [];
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            // Skip non-student items (like votes, currentUser, etc.)
            if (key.startsWith("hasVoted_") || key === "votes" || key === "currentUser") continue;
            
            try {
                const student = JSON.parse(localStorage.getItem(key));
                if (student && student.admNo) {
                    students.push(student);
                }
            } catch (e) {
                console.error("Error parsing student data for key:", key);
            }
        }

        // Populate the table
        if (students.length === 0) {
            tableBody.innerHTML = "<tr><td colspan='4'>No students registered</td></tr>";
        } else {
            students.forEach(student => {
                const row = document.createElement("tr");
                row.innerHTML = `
                    <td>${student.admNo}</td>
                    <td>${student.studentName}</td>
                    <td>${student.gender}</td>
                    <td>
                        <button class="delete-btn" data-admno="${student.admNo}">Delete</button>
                    </td>
                `;
                tableBody.appendChild(row);
            });

            // Add event listeners to delete buttons
            document.querySelectorAll(".delete-btn").forEach(btn => {
                btn.addEventListener("click", function() {
                    const admNo = this.getAttribute("data-admno");
                    if (deleteStudent(admNo)) {
                        refreshStudentTable();
                        alert("Student deleted successfully!");
                    }
                });
            });
        }
    }

    // Form submission handler for delete by admission number
    const deleteForm = document.getElementById("deleteForm");
    if (deleteForm) {
        deleteForm.addEventListener("submit", function(e) {
            e.preventDefault();
            const admNo = document.getElementById("deleteAdmNo").value.trim();
            
            if (!admNo) {
                alert("Please enter an admission number");
                return;
            }

            if (deleteStudent(admNo)) {
                refreshStudentTable();
                document.getElementById("deleteAdmNo").value = ""; // Clear input
            }
        });
    }

    // Initialize the student table
    refreshStudentTable();
});
