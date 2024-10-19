import React from 'react'

export const ThemeContext = React.createContext();

export const ThemeContextProvider = ({children}) => {
  const [isBright, toggleTheme] = React.useState(true)
  const content = {isBright, toggleTheme}

  return <ThemeContext.Provider value={content}>
      {children}
    </ThemeContext.Provider>
}

export const useThemeContext = () => React.useContext(ThemeContext)