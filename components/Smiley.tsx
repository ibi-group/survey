// 3 is low, 8 is high. 0 is forbidden
const Smiley = ({ percentage = 0 }) => {
  if (percentage === 40) {
    percentage = 41
  }
  const calculatedTop = percentage / 20 + 3

  return (
    <svg height={100} viewBox="0 0 10 10" xmlns="http://www.w3.org/2000/svg">
      <g data-name="Layer 2" id="Layer_2">
        <g data-name="Layer 1" id="Layer_1-2">
          <circle cx="2" cy="2" r="1" />
          <circle cx="8" cy="2" r="1" />
          <path d={`M2,5 C2,${calculatedTop} 8,${calculatedTop} 8,5`} />
        </g>
      </g>
    </svg>
  )
}

export default Smiley
