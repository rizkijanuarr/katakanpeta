type ContentSectionProps = {
  children: React.JSX.Element
}

export function ContentSection({ children }: ContentSectionProps) {
  return (
    <div className='flex flex-1 flex-col'>
      <div className='faded-bottom h-full w-full overflow-y-auto scroll-smooth pe-4 pb-12'>
        <div className='-mx-1 px-1.5 lg:max-w-xl'>{children}</div>
      </div>
    </div>
  )
}
