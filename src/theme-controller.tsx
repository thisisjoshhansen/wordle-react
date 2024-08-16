import { useEffect, useMemo, useState } from "react";
import IconLight from "./icons/icon-light";
import IconDark from "./icons/icon-dark";

import './theme-controller.scss';
import IconDevices from "./icons/icon-devices";

enum Theme {
  system = '',
  light = 'light',
  dark = 'dark',
}

export default function ThemeController() {
  const [ systemTheme, setSystemTheme ] = useState<Theme>(window.matchMedia('(prefers-color-scheme: dark)').matches ? Theme.dark : Theme.light);
  const [ localTheme, setLocalTheme ] = useState<Theme>((window.localStorage.getItem('theme') as Theme) || Theme.system);

  const theme = useMemo(() => {
    if (localTheme) {
      return localTheme;
    }

    return systemTheme;
  }, [systemTheme, localTheme]);
  

  function toggleTheme() {
    if (systemTheme === Theme.dark) {
      if (localTheme === Theme.dark) {
        setLocalTheme(Theme.system);
        return;
      }

      if (localTheme === Theme.light) {
        setLocalTheme(Theme.dark);
        return;
      }

      setLocalTheme(Theme.light);
      return;
    }

    if (localTheme === Theme.dark) {
      setLocalTheme(Theme.light);
      return;
    }

    if (localTheme === Theme.light) {
      setLocalTheme(Theme.system);
      return;
    }

    setLocalTheme(Theme.dark);
  }

  function themeLabel(theme:Theme | '') {
    if (theme === Theme.light) {
      return 'Light';
    }
    if (theme === Theme.dark) {
      return 'Dark';
    }
    return 'System';
  }

  useEffect(() => {
    // save it
    if (localTheme) {
      localStorage.setItem('theme', localTheme);
    } else {
      localStorage.removeItem('theme');
    }
  }, [localTheme]);

  useEffect(() => {
    // assign proper className
    const elem = document.getElementById('root');
    elem?.classList[theme === Theme.light ? 'remove' : 'add']('dark-theme');
  }, [theme]);

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const themeChange = (event: MediaQueryListEvent) => {
      if (event.matches) {
        setSystemTheme(Theme.dark);
      } else {
        setSystemTheme(Theme.light);
      }
    };

    mediaQuery.addEventListener('change', themeChange);

    return () => {
      mediaQuery.removeEventListener('change', themeChange);
    };
  }, []);

  return <div className="theme-controller">
    <button onClick={toggleTheme} className="theme-controller__button">
      { localTheme === '' && <IconDevices></IconDevices> }
      { localTheme === Theme.dark && <IconDark></IconDark> }
      { localTheme === Theme.light && <IconLight></IconLight> }
    </button>
    <div className="theme-controller__label">
      Theme: { themeLabel(localTheme) }
    </div>
  </div>;
}
