console.log("Start")

// The provided course information.
const CourseInfo = {
    id: 451,
    name: "Introduction to JavaScript"
  };
  
  // The provided assignment group.
  const AssignmentGroup = {
    id: 12345,
    name: "Fundamentals of JavaScript",
    course_id: 451,   
    group_weight: 25,    // percentage 
    assignments: [
      {
        id: 1,
        name: "Declare a Variable",
        due_at: "2023-01-25",  
        points_possible: 50    // the maximum points possible for the assignment
      },
      {
        id: 2,
        name: "Write a Function",
        due_at: "2023-02-27",
        points_possible: 150
      },
      {
        id: 3,
        name: "Code the World",
        due_at: "3156-11-15",
        points_possible: 500
      }
    ]
  };
  
  // The provided learner submission data.
  const LearnerSubmissions = [
    {
      learner_id: 125,
      assignment_id: 1,
      submission: {
        submitted_at: "2023-01-25",
        score: 47
      }
    },
    {
      learner_id: 125,
      assignment_id: 2,
      submission: {
        submitted_at: "2023-02-12",
        score: 150
      }
    },
    {
      learner_id: 125,
      assignment_id: 3,
      submission: {
        submitted_at: "2023-01-25",
        score: 400
      }
    },
    {
      learner_id: 132,
      assignment_id: 1,
      submission: {
        submitted_at: "2023-01-24",
        score: 39
      }
    },
    {
      learner_id: 132,
      assignment_id: 2,
      submission: {
        submitted_at: "2023-03-07",
        score: 140
      }
    }
  ];
  


//////////////////////////////////////////////////////////////////////////

//If an AssignmentGroup does not belong to its course
function GroupBelongsToCourse (CourseInfo, AssignmentGroup) {
    if (CourseInfo.id !== AssignmentGroup.course_id) {
        throw new Error ("Error: This assignment Group does NOT belong to the Course!");
    }
    return true; // if the group belongs to the course
}
try {
    const groupValidationResult = GroupBelongsToCourse(CourseInfo, AssignmentGroup);
    console.log("Does this group belongs to course? - ", groupValidationResult);
} catch (Error) {
    console.error(Error.message);
}


// Check if a learner's submission is valid.
function validSubmission(submission, assignment) {
    const finalScore = submission.submission.score;
    const pointsPossible = assignment.points_possible;
 const isValid = pointsPossible > 0 && typeof finalScore === "number" && !isNaN(finalScore);
 return isValid; 
}
function validateSubmissions(submissions, assignments) {
    submissions.forEach(submission => {
        const assignment = assignments.find(a => a.id === submission.assignment_id);
        const isValid = validSubmission(submission, assignment);
        console.log(`Submission for learner ${submission.learner_id} on assignment ${submission.assignment_id} is ${isValid ? 'valid' : 'not valid'}.`);
    });
}
validateSubmissions(LearnerSubmissions, AssignmentGroup.assignments);




function getLearnerData(course, ag, submissions) {
    const result = [];  //empty array to store data

    ag.assignments.forEach(assignment => {
        try {
            const dueDate = new Date(assignment.due_at);  // Convert to object


            // Check if points valid 
            if (assignment.points_possible <= 0) {
                throw new Error(`Assignment ${assignment.id} has invalid points_possible: ${assignment.points_possible}`);
            }

            // Process each submission for the current assignment
            submissions.forEach(submission => {
                try {
                    // Check -submission belongs to the assignment
                    if (submission.assignment_id === assignment.id) {

                        // Find learner 
                        let learner = result.find(l => l.id === submission.learner_id);

                        // If the learner doesnt exist - create a new object
                        if (!learner) {
                            learner = { id: submission.learner_id, avg: 0, totalPoints: 0, totalPossible: 0 };
                            result.push(learner);
                        }

                        const submittedDate = new Date(submission.submission.submitted_at);  // Convert submission!! date to object
                        let score = submission.submission.score;  // Get the score for this submission

                        // Check if the submission was late... comparing dates!
                        const isLate = submittedDate > dueDate;

                        // If late, -10%
                        if (isLate) {
                            score *= 0.9;
                            console.log(`Late submission ${submission.learner_id} on assignment ${assignment.id}: Score adjusted to ${score}`);
                        }

                        // % learner score
                        const percentage = score / assignment.points_possible;
                        console.log(`Learner ${submission.learner_id} scored ${percentage * 100}% on assignment ${assignment.id}`);

                        // Store the percentage score in the object..
                        learner[assignment.id] = percentage;

                        // Update points
                        learner.totalPoints += score;
                        learner.totalPossible += assignment.points_possible;
                    }
                } catch (error) {
                    console.error(`Error processing submission for learner ${submission.learner_id} on assignment ${assignment.id}:`, error.message);
                }
            });
        } catch (error) {
            console.error(`Error processing assignment ${assignment.id}:`, error.message);
        }
    });}


