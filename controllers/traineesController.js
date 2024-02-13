import bcrypt from 'bcrypt';

const traineesData = [];

export const getAllTrainees = async (req, res) => {
  if (traineesData.length === 0) {
    res.status(404).json({ message: 'No trainees found' });
    return;
  }

  // To create a new object to remove the hashed password from the response
  const allTrainees = [...traineesData];
  allTrainees.forEach((trainee) => {
    delete trainee.hashedPassword;
  });

  res.status(200).json(allTrainees);
};

export const getTrainee = async (req, res) => {
  // TODO: Implement
  res.status(500).send('Not implemented');
};

export const addTrainee = async (req, res) => {
  const { name, password, cohort } = req.body;
  const hashedPassword = await bcrypt.hash(password, 12);

  //To check if the request body is empty or not
  if (!name || !password || !cohort) {
    res.status(400).json({ message: 'Invalid request' });
    return;
  }

  //To check if the trainee already exists or not
  const existingTrainee = traineesData.find(
    (trainee) => trainee.name === name && trainee.cohort === cohort
  );

  if (existingTrainee) {
    res.status(400).json({ message: 'Trainee already exists' });
    return;
  }

  //To check name has at least 3 characters
  if (name.length < 3) {
    res.status(400).json({ message: 'Name should have atleast 3 characters' });
    return;
  }

  //to check password has at least 8 characters
  if (password.length < 8) {
    res
      .status(400)
      .json({ message: 'Password should have atleast 8 characters' });
    return;
  }

  //To check if cohort is a number bigger than 0
  if (isNaN(cohort) || cohort < 1) {
    res
      .status(400)
      .json({ message: 'Cohort should be a number bigger than 0' });
    return;
  }

  let newTrainee = {
    id: crypto.randomUUID(),
    name,
    cohort,
    hashedPassword,
  };

  traineesData.push(newTrainee);

  // To create a new object to remove the hashed password from the response
  // this step is necessary to avoid deleting the hashed password from the original object as all the objects in the array are references to the same object
  newTrainee = { ...newTrainee };

  //To remove the hashed password from the response
  delete newTrainee.hashedPassword;

  res.status(201).json(newTrainee);
};

export const updateTrainee = async (req, res) => {
  // TODO: Implement
  res.status(500).send('Not implemented');
};

export const deleteTrainee = async (req, res) => {
  // TODO: Implement
  res.status(500).send('Not implemented');
};

export const traineeLogin = async (req, res) => {
  // TODO: Implement
  res.status(500).send('Not implemented');
};
