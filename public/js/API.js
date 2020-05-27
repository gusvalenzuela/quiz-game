module.exports = {
  saveToLocalStorage(initials, score) {
    localStorage.setItem(`last-user-initials`, initials);
    var storedInitials = []
    var storedScores = []

    storedInitials.push(initials);
    localStorage.setItem(
      this.name + `-stored-initials`,
      JSON.stringify(storedInitials)
    ); // store initials in local storage array

    storedScores.push(parseInt(score)); // push score into working array storedScores
    localStorage.setItem(
      this.name + `-stored-scores`,
      JSON.stringify(storedScores)
    ); // store score in local storage array
    // console.log(`Your storedScores is: ` + storedScores)
  },
};
