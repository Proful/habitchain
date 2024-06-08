import type { MetaFunction } from '@remix-run/node'
import { useParams } from '@remix-run/react'
import { useEffect, useState } from 'react'
import { useSwipeable } from 'react-swipeable'

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '~/components/ui/dialog'
import { Textarea } from '~/components/ui/textarea'

export const meta: MetaFunction = () => {
  return [
    { title: 'View Habit' },
    { name: 'description', content: 'View Habit' },
  ]
}

type HabitData = {
  [habitName: string]: {
    [year: string]: {
      [month: string]: number[]
    }
  }
}

type SelectedDayData = {
  [habitName: string]: {
    [year: string]: {
      [month: string]: {
        [day: string]: string
      }
    }
  }
}

// Get the current date
const currentDate = new Date()
const _currentDay = currentDate.getDate()
const _currentMonth = currentDate.getMonth() + 1 // getMonth() is zero-based
const _currentYear = currentDate.getFullYear()
const _currentMonthName = currentDate.toLocaleString('default', {
  month: 'short',
})
export default function ViewHabit() {
  const { habitName } = useParams()
  const [habitData, setHabitData] = useState<HabitData | null>(null)
  const [clickedDays, setClickedDays] = useState<number[]>([])
  const [isCurrentDayPressed, setIsCurrentDayPressed] = useState<boolean>(false)
  const [loaded, setLoaded] = useState<boolean>(false)
  const [isOpenDialog, setIsOpenDialog] = useState<boolean>(false)
  const [todaysDay, setSelectedDay] = useState(_currentDay)
  const [clickedDay, setClickedDay] = useState(_currentDay)
  const [selectedMonth, setSelectedMonth] = useState(_currentMonth)
  const [selectedYear, setSelectedYear] = useState(_currentYear)
  const [selectedMonthName, setSelectedMonthName] = useState(_currentMonthName)
  const [singleSelectedDayData, setSingleSelectedDayData] = useState('')
  const [weeks, setWeeks] = useState(null)

  const handlers = useSwipeable({
    onSwipedLeft: () => {
      setSelectedMonth(selectedMonth + 1)
    },
    onSwipedRight: () => {
      setSelectedMonth(selectedMonth - 1)
    },
  })

  useEffect(() => {
    if (
      habitData &&
      habitData[habitName!] &&
      habitData[habitName!][selectedYear] &&
      habitData[habitName!][selectedYear][selectedMonth]
    ) {
      setClickedDays(habitData![habitName!][selectedYear][selectedMonth] || [])
    } else {
      setClickedDays([])
    }
    const currentDate = new Date()
    currentDate.setMonth(selectedMonth - 1)
    const _currentMonthName = currentDate.toLocaleString('default', {
      month: 'short',
    })
    setSelectedMonthName(_currentMonthName)
    //@ts-ignore
    setWeeks(getWeeks(selectedMonth, selectedYear))
  }, [selectedMonth])

  // Load saved clickedDays from AsyncStorage
  useEffect(() => {
    const loadClickedDays = async () => {
      try {
        const savedHabitData = localStorage.getItem('habitData')
        if (savedHabitData !== null) {
          const tmp = JSON.parse(savedHabitData)
          setHabitData(tmp)
          setClickedDays(tmp[habitName!][selectedYear][selectedMonth] || [])
        }
      } catch (error) {
        console.error('Error loading habitData from AsyncStorage:', error)
      } finally {
        setLoaded(true)
      }
    }

    loadClickedDays()
  }, [])

  // Save clickedDays to AsyncStorage whenever it changes
  useEffect(() => {
    if (loaded) {
      let updatedHabitData = habitData || {}
      if (!updatedHabitData[habitName!]) {
        updatedHabitData[habitName!] = {}
      }

      if (!updatedHabitData[habitName!][selectedYear]) {
        updatedHabitData[habitName!][selectedYear] = {}
      }

      updatedHabitData[habitName!][selectedYear][selectedMonth] = clickedDays
      setHabitData(updatedHabitData)
      localStorage.setItem('habitData', JSON.stringify(updatedHabitData))
    }
  }, [clickedDays, loaded])

  useEffect(() => {
    let data = JSON.parse(localStorage.getItem('selectedDayData') || '{}')
    let updatedSelectedData = data || {}
    if (!updatedSelectedData[habitName!]) {
      updatedSelectedData[habitName!] = {}
    }

    if (!updatedSelectedData[habitName!][selectedYear]) {
      updatedSelectedData[habitName!][selectedYear] = {}
    }

    if (!updatedSelectedData[habitName!][selectedYear][selectedMonth]) {
      updatedSelectedData[habitName!][selectedYear][selectedMonth] = {}
    }

    updatedSelectedData[habitName!][selectedYear][selectedMonth][clickedDay] =
      singleSelectedDayData
    localStorage.setItem('selectedDayData', JSON.stringify(updatedSelectedData))
  }, [singleSelectedDayData])

  const handlePress = (selectedDay: number | null) => {
    setClickedDay(selectedDay!)
    let dt = new Date()
    let day = dt.getDate()
    let month = dt.getMonth() + 1
    let year = dt.getFullYear()

    // console.log(day, month, year)
    if (selectedDay !== null) {
      const isFutureDate =
        year > selectedYear ||
        (year === selectedYear && month < selectedMonth) ||
        (year === selectedYear && month === selectedMonth && day < selectedDay)

      // console.log('isFutureDate', isFutureDate)

      const isPrevClickedDays = clickedDays.includes(selectedDay)
      if (!isFutureDate && !isPrevClickedDays) {
        setClickedDays([...clickedDays, selectedDay])
      } else if (!isFutureDate && isPrevClickedDays) {
        let data = JSON.parse(localStorage.getItem('selectedDayData') || '{}')
        let clickedData =
          data[habitName!][selectedYear][selectedMonth][selectedDay]
        if (clickedData) {
          setSingleSelectedDayData(clickedData)
        } else {
          setSingleSelectedDayData('')
        }
        // setSelectedDayData(selectedDayData)
        // console.log('isPrevClickedDays', isPrevClickedDays)
        setIsOpenDialog(true)
      }
      // Toggle the state for the current day
      if (
        day === selectedDay &&
        month === selectedMonth &&
        year === selectedYear
      ) {
        setIsCurrentDayPressed((prev) => !prev)
      }
    }
  }

  return (
    <div {...handlers} className="flex flex-col p-5 justify-center">
      <div className="screen">
        <h1 className="text-xl">{habitName?.toUpperCase()}</h1>
      </div>
      <span className="text-center text-2xl mb-5">{selectedMonthName}</span>
      <div className="flex justify-evenly items-center pb-1.5">
        <span className="w-8 h-8 flex justify-center items-center text-center">
          S
        </span>
        <span className="w-8 h-8 flex justify-center items-center text-center">
          M
        </span>
        <span className="w-8 h-8 flex justify-center items-center text-center">
          T
        </span>
        <span className="w-8 h-8 flex justify-center items-center text-center">
          W
        </span>
        <span className="w-8 h-8 flex justify-center items-center text-center">
          Th
        </span>
        <span className="w-8 h-8 flex justify-center items-center text-center">
          F
        </span>
        <span className="w-8 h-8 flex justify-center items-center text-center">
          Sa
        </span>
      </div>
      {
        //@ts-ignore
        weeks &&
          //@ts-ignore
          weeks!.map((week, weekIndex) => (
            <div
              key={weekIndex}
              className="flex justify-evenly items-center pb-1.5"
            >
              {
                //@ts-ignore
                week.map((day, dayIndex) => (
                  <div
                    key={dayIndex}
                    className="w-8 h-8 flex justify-center items-center text-center relative"
                    onClick={() => handlePress(day)}
                  >
                    <span
                      className={`text-center ${
                        day === todaysDay &&
                        _currentMonth === selectedMonth &&
                        _currentYear === selectedYear &&
                        !isCurrentDayPressed
                          ? 'border border-blue-500 rounded-full bg-blue-100'
                          : ''
                      }`}
                    >
                      {day !== null ? day : ''}
                    </span>
                    {clickedDays.includes(day!) && (
                      <div className="absolute top-0 left-0 w-full h-full bg-red-500 bg-opacity-50" />
                    )}
                  </div>
                ))
              }
            </div>
          ))
      }

      <Dialog open={isOpenDialog} onOpenChange={setIsOpenDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{`${clickedDay}-${selectedMonthName}-${selectedYear}`}</DialogTitle>
            <DialogDescription>
              <Textarea
                value={singleSelectedDayData}
                onChange={(e) => setSingleSelectedDayData(e.target.value)}
              />
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  )
}

function getWeeks(selectedMonth: number, selectedYear: number) {
  const daysInMonth = getDaysInMonth(selectedMonth, selectedYear)
  const firstDayOfWeek = getFirstDayOfWeek(selectedMonth, selectedYear)

  // Generate an array of dates for each day of the month
  const daysArray = Array.from({ length: daysInMonth }, (_, index) => index + 1)

  // Add empty cells to the beginning to align the start day
  const alignedDaysArray = addEmptyCells(firstDayOfWeek).concat(daysArray)

  // Calculate how many empty cells to add at the end
  const totalCells = 7 * Math.ceil(alignedDaysArray.length / 7)
  const emptyCellsAtEnd = totalCells - alignedDaysArray.length
  const finalDaysArray = alignedDaysArray.concat(
    Array(emptyCellsAtEnd).fill(null),
  )

  // Split daysArray into chunks of 7 for each week
  const weeks = chunkArray(finalDaysArray, 7)
  return weeks
}
// Function to get the number of days in a month
function getDaysInMonth(month: number, year: number): number {
  return new Date(year, month, 0).getDate()
}

// Function to get the day of the week for the first day of the month
function getFirstDayOfWeek(month: number, year: number): number {
  return new Date(year, month - 1, 1).getDay()
}

// Function to add empty cells to align the start day
function addEmptyCells(firstDayOfWeek: number): (number | null)[] {
  const emptyCells: (number | null)[] = []
  for (let i = 0; i < firstDayOfWeek; i++) {
    emptyCells.push(null)
  }
  return emptyCells
}

// Function to split an array into chunks
function chunkArray<T>(array: T[], size: number): T[][] {
  const chunkedArray: T[][] = []
  for (let i = 0; i < array.length; i += size) {
    chunkedArray.push(array.slice(i, i + size))
  }
  return chunkedArray
}
