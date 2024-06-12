const portfolioSort = (a, b) => {
  const nameA = a.label.toUpperCase()
  const nameB = b.label.toUpperCase()

  if (nameA < nameB) {
    return -1
  }
  else if (nameA > nameB) {
    return 1
  }
  else {
    return 0
  }
}

export default portfolioSort
