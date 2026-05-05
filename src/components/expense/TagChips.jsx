import { TAG_COLORS, TAGS } from '../../utils/tagConfig'

export default function TagChips({ selected, onSelect }) {
  return (
    <div className="flex flex-wrap gap-2">
      {TAGS.map((tag) => {
        const isSelected = tag === selected
        const color = TAG_COLORS[tag]

        return (
          <button
            key={tag}
            type="button"
            className="chip-button"
            style={{
              backgroundColor: isSelected ? color : 'rgba(255, 255, 255, 0.7)',
              borderColor: color,
              color: isSelected ? '#ffffff' : '#292524',
            }}
            onClick={() => onSelect(tag)}
          >
            {tag}
          </button>
        )
      })}
    </div>
  )
}
