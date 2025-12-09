import { Moon, Sun } from "lucide-react";

import { Button } from "./button";
import { useTheme } from "@shared/lib/hooks/use-theme";

export const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();

  return (
    <Button onClick={toggleTheme} variant='ghost' size='icon'>
      {theme === "light" ? <Moon className='h-4 w-4' /> : <Sun className='h-4 w-4' />}
    </Button>
  );
};

