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

// Check if an AssignmentGroup belongs to its course
function GroupBelongsToCourse(CourseInfo, AssignmentGroup) {
    if (CourseInfo.id !== AssignmentGroup.course_id) {
        throw new Error("Error: This assignment Group does NOT belong to the Course!");
    }
    return true;
}
try {
    const groupValidationResult = GroupBelongsToCourse(CourseInfo, AssignmentGroup);
    console.log("Does this group belongs to course? - ", groupValidationResult);
} catch (Error) {
    console.error(Error.message);
}

// Check if a learner's submission is valid
function validSubmission(submission, assignment) {
    const finalScore = submission.submission.score;  // Get the score the learner received
    const pointsPossible = assignment.points_possible;  // Get the possible points for the assignment

    // Check if the score is a valid number and if the possible points are greater than 0
    const isValid = pointsPossible > 0 && typeof finalScore === "number" && !isNaN(finalScore);
    return isValid;  // Return whether the submission is valid
}

// Validate submissions
// This function goes through each learner submission and validates it. based on possible points
function validateSubmissions(submissions, assignments) {
    submissions.forEach(submission => {
        const assignment = assignments.find(a => a.id === submission.assignment_id);  // Find the corresponding assignment
        const isValid = validSubmission(submission, assignment);  // Validate the submission
        console.log(`Submission for learner ${submission.learner_id} on assignment ${submission.assignment_id} is ${isValid ? 'valid' : 'not valid'}.`);
    });
}

// Validate all the learner submissions for the provided assignments
validateSubmissions(LearnerSubmissions, AssignmentGroup.assignments);

//////////////////////////////////////////////////////////////////////////


// Process and calculate learner data
function getLearnerData(course, ag, submissions) {
    const result = [];  // Initialize an empty array to store learner results

    ag.assignments.forEach(assignment => {
        try {
            const dueDate = new Date(assignment.due_at);  //Convert due date to object
            const today = new Date();  //current date

            // Skip future assignments
            // If the assignment due date is in the future we skip processing it
            if (dueDate > today) {
                console.log(`Skipping future assignment: ${assignment.name} (due at ${assignment.due_at})`);
                return;
            }


            // Process each submission for the current assignment
            submissions.forEach(submission => {
                try {
                    if (submission.assignment_id === assignment.id) {
                        
                        let learner = result.find(l => l.id === submission.learner_id);// Check if the learner is already in the result array

                        // If the learner doesn't exist in the result, create a new object 
                        if (!learner) {
                            learner = { id: submission.learner_id, avg: 0, totalPoints: 0, totalPossible: 0 };
                            result.push(learner);
                        }

                        const submittedDate = new Date(submission.submission.submitted_at);  // Convert the submission date to object
                        let score = submission.submission.score;  // Get the score from the submission

                        //late penalty 10%
                        const isLate = submittedDate > dueDate;
                        if (isLate) {
                            score *= 0.9;  
                            console.log(`Late submission ${submission.learner_id} on assignment ${assignment.id}: Score adjusted to ${score}`);
                        }

                        // Calculate the percentage score for the assignment
                        const percentage = score / assignment.points_possible;
                        console.log(`Learner ${submission.learner_id} scored ${percentage * 100}% on assignment ${assignment.id}`);

                       
                        learner[assignment.id] = percentage; // Store the percentage score in the learner's result object

                        // Update the total points and possible points for calculating the learner's weighted average
                        learner.totalPoints += score;
                        learner.totalPossible += assignment.points_possible;
                    }


                } catch (error) {
                    // Catch errors
                    console.error(`Error processing submission for learner ${submission.learner_id} on assignment ${assignment.id}:`, error.message);
                }

            });


        } catch (error) {
            // Catch errors during assignment processing
            console.error(`Error processing assignment ${assignment.id}:`, error.message);
        }


    });

     // Calculate the weighted average for each learner
     result.forEach(learner => {
        try {
            // Ensure total possible points is greater than 0 
            if (learner.totalPossible > 0) {
                // Calculate the average by dividing the total points by the total possible points
                learner.avg = learner.totalPoints / learner.totalPossible;
            } else {
                // If there are no possible points, log an error
                throw new Error(`Total points for learner ${learner.id} is 0, cannot calculate average`);
            }
            console.log(`Learner ${learner.id} - Weighted Average Score: ${(learner.avg * 100).toFixed(2)}%`);
        } catch (error) {
            // Catch errors 
            console.error(`Error calculating average for learner ${learner.id}:`, error.message);
        }
    });

    return result;  // Return the final array of learner data
}