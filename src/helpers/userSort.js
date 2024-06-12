const userSort = (a, b) => {
  const namesA = (a.label || a.username).split(' ').map(n => n.toUpperCase())
  const lastA = namesA.pop()
  const restA = namesA.join(' ')

  const namesB = (b.label || b.username).split(' ').map(n => n.toUpperCase())
  const lastB = namesB.pop()
  const restB = namesB.join(' ')

  if (lastA < lastB) {
    return -1
  }

  else if (lastA > lastB) {
    return 1
  }

  else {
    if (restA < restB) {
      return -1
    }
    else if (restA > restB) {
      return 1
    }
    else {
      return 0
    }
  }
}

export default userSort
