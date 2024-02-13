import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

let traineesData = [];

const secret = '123456789t';

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
  const { id } = req.params;

  const trainee = traineesData.find((trainee) => trainee.id === id);

  if (!trainee) {
    res.status(404).json({ message: 'Trainee not found' });
    return;
  }

  // To create a new object to remove the hashed password from the response
  const traineeResponse = { ...trainee };
  delete traineeResponse.hashedPassword;

  res.status(200).json(traineeResponse);
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
  const { id } = req.params;
  const { name, password, cohort } = req.body;

  let traineeToBeUpdate = traineesData.find((trainee) => trainee.id === id);

  // need to update to check if the user is the same as the trainee that logged in
  // check with session or token jwt

  const token = req.headers.authorization.split(' ')[1];
  const decodedToken = jwt.verify(token, secret);
  if (traineeToBeUpdate.id !== decodedToken.id) {
    res.status(403).json({ message: 'Forbidden request' });
    return;
  }

  if (!traineeToBeUpdate) {
    res.status(404).json({ message: 'Trainee not found' });
    return;
  }

  if (name) {
    if (name.length < 3) {
      res
        .status(400)
        .json({ message: 'Name should have atleast 3 characters' });
      return;
    }
    traineeToBeUpdate.name = name;
  }

  if (password) {
    if (password.length < 8) {
      res
        .status(400)
        .json({ message: 'Password should have atleast 8 characters' });
      return;
    }
    traineeToBeUpdate.hashedPassword = await bcrypt.hash(password, 12);
  }

  if (cohort) {
    if (isNaN(cohort) || cohort < 1) {
      res
        .status(400)
        .json({ message: 'Cohort should be a number bigger than 0' });
      return;
    }
    traineeToBeUpdate.cohort = cohort;
  }

  //update the trainee in the array

  traineesData = traineesData.map((trainee) =>
    trainee.id === id ? traineeToBeUpdate : trainee
  );

  // To create a new object to remove the hashed password from the response
  const updatedTrainee = { ...traineeToBeUpdate };
  delete updatedTrainee.hashedPassword;

  res.status(200).json(updatedTrainee);
};

export const deleteTrainee = async (req, res) => {
  const { id } = req.params;
  const traineeToBeDeleted = traineesData.find((trainee) => trainee.id === id);
  // need to update to check if the user is the same as the trainee that logged in
  // check with session or token jwt

  const token = req.headers.authorization.split(' ')[1];
  const decodedToken = jwt.verify(token, secret);

  if (traineeToBeDeleted.id !== decodedToken.id) {
    res.status(403).json({ message: 'Forbidden request' });
    return;
  }

  if (!traineeToBeDeleted) {
    res.status(404).json({ message: 'Trainee not found' });
    return;
  }

  traineesData = traineesData.filter((trainee) => trainee.id !== id);
  res.status(200).json({ message: 'Trainee deleted' });
};

export const traineeLogin = async (req, res) => {
  const { id, password } = req.body;

  const trainee = traineesData.find((trainee) => trainee.id === id);

  if (!trainee) {
    res.status(404).json({ message: 'Invalid Credential' });
    return;
  }

  const isPasswordValid = await bcrypt.compare(
    password,
    trainee.hashedPassword
  );

  if (!isPasswordValid) {
    res.status(401).json({ message: 'Invalid Credential' });
    return;
  }

  const token = jwt.sign({ id: trainee.id, name: trainee.name }, secret, {
    expiresIn: '1h',
  });

  res.status(200).json({ token });
};
