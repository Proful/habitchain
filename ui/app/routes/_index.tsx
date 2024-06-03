import type { MetaFunction } from '@remix-run/node'
import { Link } from '@remix-run/react'
import { useEffect, useState } from 'react'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'

export const meta: MetaFunction = () => {
  return [
    { title: 'Habitchain' },
    { name: 'description', content: "Habitchain - Don't break the chain" },
  ]
}

export default function Index() {
  const [habit, setHabit] = useState('')
  const [habits, setHabits] = useState<string[]>([])
  const addNewHabit = () => {
    setHabits([...habits, habit])
    setHabit('')
  }
  useEffect(() => {
    let habits = localStorage.getItem('habits')
    if (habits != null) {
      habits = JSON.parse(habits)
      setHabits(habits as unknown as string[])
    }
  }, [])
  useEffect(() => {
    if (habits.length > 0) {
      localStorage.setItem('habits', JSON.stringify(habits))
    }
  }, [habits])
  return (
    <>
      <div className="flex space-x-2 ml-2 mt-1">
        <Input
          type="habit"
          value={habit}
          onChange={(e) => setHabit(e.target.value)}
          placeholder="New habit"
        />
        <Button type="submit" onClick={addNewHabit}>
          Submit
        </Button>
      </div>
      <div>
        <ul className="ml-2 mt-2">
          {habits.map((h) => (
            <li key={h}>
              <Link to={`/habits/${h}`} className="mr-2">
                {h}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </>
  )
}
