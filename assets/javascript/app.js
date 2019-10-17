// firebase config
  const config = {
    apiKey: 'AIzaSyBLEo7tfUVHanNWFlVprTOkggJs2aSxvRU',
    authDomain: 'traintime-7dae1.firebaseapp.com',
    databaseURL: 'https://traintime-7dae1.firebaseio.com',
    projectId: 'traintime-7dae1',
    storageBucket: 'traintime-7dae1.appspot.com',
    messagingSenderId: '971215267821',
    appId: '1:971215267821:web:32d0c52b345e10960369e4',
    measurementId: 'G-0M7WWQHLD5'
  };

  // initialize firebase
  firebase.initializeApp(config);

  // firebase database
  let database = firebase.firestore()

  // submit button
  document.getElementById('submit').addEventListener('click', e => {
    e.preventDefault()

    // input
    let nameIn = document.getElementById('trainName').value

    let destinationIn = document.getElementById('destination').value

    let trainTimeIn = document.getElementById('firstTrainTime').value

    let frequencyIn = document.getElementById('frequency').value

    // new trains
    const newTrain = {
      name: nameIn,
      destination: destinationIn,
      firstTime: trainTimeIn,
      frequency: frequencyIn
    }

    // storing input in db
    database
            .collection('trains')
            .doc(newTrain.name)
            .set(newTrain)

    // reset
    document.getElementById('trainName').value = ''
    document.getElementById('destination').value = ''
    document.getElementById('firstTrainTime').value = ''
    document.getElementById('frequency').value = ''

    // making sure inputs are added
    if (nameIn == '' &&
        destinationIn == '' &&
        trainTimeIn == '' &&
        frequencyIn == '') {
          document.getElementById('alert').innerHTML = `
              <div class="alert" role="alert">
              <strong>Fill out train form please</strong>
              <button type="button" class="close" data-dismiss="alert"></button>
              </div>
            `
        } else {
          // add rows for current train schedule
          database
                  .collection('trains')
                  .onSnapshot(({ docs }) => {
                    docs.forEach(train => {
                      let { name, destination, firstTime, frequency } = train.data()
                      let trainElem = document.createElement('tr')
                      trainElem.innerHTML = `
                      
                      <td> ${name} </td>
                      <td> ${destination} </td>
                      <td> ${frequency} </td>
                      <td> next arrival </td>
                      <td> minutes away </td>
                      
                        `
                        document.getElementById('tableBody').append(trainElem)
                    })
                  })
        }
  })

// using moment for changing rate
const getNext = (original, rate) => {

  const rateInSeconds = rate*60

  const now = moment().unix()

  let lapse = original

  while (lapse<now) {
    lapse+=rateInSeconds
  }

  return moment((lapse+rate), 'X').format('MMMM, Do YYYY hh:mm a')
}