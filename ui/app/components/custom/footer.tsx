export default function Footer() {
  return (
    <footer>
      <div className="container flex flex-col items-center justify-between gap-4 py-10 md:h-24 md:flex-row md:py-0">
        <div className="flex flex-col items-center gap-4 px-8 md:flex-row md:gap-2 md:px-0">
          <p className="text-center text-sm leading-loose md:text-left">
            <img
              src="/buildfast.svg"
              alt="logo"
              className="w-6 h-6 inline mr-2"
            />
            Built by{' '}
            <a
              href="http://www.twitter.com/profulsadangi"
              target="_blank"
              rel="noreferrer"
              className="font-medium underline underline-offset-4"
            >
              proful
            </a>
          </p>
        </div>
      </div>
    </footer>
  )
}
