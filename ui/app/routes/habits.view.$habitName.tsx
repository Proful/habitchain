import type { MetaFunction } from '@remix-run/node'
import { useParams } from '@remix-run/react'
import React from 'react'
import { useEffect, useState } from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '~/components/ui/card'

export const meta: MetaFunction = () => {
  return [
    { title: 'View Habit Details' },
    { name: 'description', content: 'View Habit Details' },
  ]
}

export default function ViewDetailsHabit() {
  const { habitName } = useParams()
  const [flattenedData, setFlattenedData] = useState<any | null>(null)

  // Load saved clickedDays from AsyncStorage
  useEffect(() => {
    const loadClickedDays = () => {
      const savedHabitData = localStorage.getItem('selectedDayData')
      if (savedHabitData != null) {
        const data = JSON.parse(savedHabitData)
        const flattenedData = [] as any[]
        const year = Object.keys(data[habitName!])[0]
        const months = data[habitName!][year]

        Object.keys(months).forEach((month) => {
          const days = months[month]
          Object.keys(days).forEach((day) => {
            flattenedData.push({
              date: `${year}-${month}-${day}`,
              value: days[day],
            })
          })
        })

        // Sort the flattened data by date in descending order
        // @ts-ignore
        flattenedData.sort((a, b) => new Date(b.date) - new Date(a.date))
        setFlattenedData(flattenedData)
      }
    }

    loadClickedDays()
  }, [])
  return (
    <ul className="ml-4 space-y-2">
      {flattenedData &&
        //@ts-ignore
        flattenedData.map((item, index) => (
          <li key={index}>
            <Card>
              <CardHeader>
                <CardTitle>{formatDate(item.date)}</CardTitle>
                <CardDescription>{getDayOfWeek(item.date)}</CardDescription>
              </CardHeader>
              <CardContent>
                <p>
                  {
                    //@ts-ignore
                    item.value.split('\n').map((line, index) => (
                      <React.Fragment key={index}>
                        {line}
                        <br />
                      </React.Fragment>
                    ))
                  }
                </p>
              </CardContent>
            </Card>
          </li>
        ))}
    </ul>
  )
}
function formatDate(inputDate: string) {
  const months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ]

  // Split the input date into components
  const [year, month, day] = inputDate.split('-')

  // Convert the month number to month name
  const monthName = months[parseInt(month) - 1]

  // Return the formatted date
  return `${day} ${monthName} ${year}`
}
function getDayOfWeek(dateString: string) {
  const daysOfWeek = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
  ]

  // Create a new Date object from the input date string
  const date = new Date(dateString)

  // Get the day of the week as a number (0-6)
  const dayIndex = date.getDay()

  // Return the day of the week
  return daysOfWeek[dayIndex]
}
