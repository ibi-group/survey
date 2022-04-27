const Smiley = ({ percentage = 50 }) => {
  // Avoid forbidden 0
  if (percentage === 40) {
    percentage = 42
  }

  // 3 is low, 8 is high. 0 is forbidden
  const calculatedTop = percentage / 20 + 3

  return (
    <svg height={100} viewBox="0 0 10 10" xmlns="http://www.w3.org/2000/svg">
      <g>
        <g>
          <circle cx="2" cy="2" r="1" />
          <circle cx="8" cy="2" r="1" />
          <path d={`M2,5 C2,${calculatedTop} 8,${calculatedTop} 8,5`} />
        </g>
      </g>
    </svg>
  )
}

export default Smiley
