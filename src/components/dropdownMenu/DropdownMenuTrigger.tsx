import clsx from "clsx";
import { useDevice } from "../App";

const MenuTrigger = ({
  className = "",
  children,
  onToggle,
  title,
}: {
  className?: string;
  children: React.ReactNode;
  onToggle: () => void;
  title?: string;
}) => {
  const device = useDevice();
  const classNames = clsx(
    `dropdown-menu-button ${className}`,
    "zen-mode-transition",
    {
      "dropdown-menu-button--mobile": device.isMobile,
    },
  ).trim();
  return (
    <button
      data-prevent-outside-click
      className={classNames}
      onClick={onToggle}
      type="button"
      data-testid="dropdown-menu-button"
      title={title}
    >
      {children}
    </button>
  );
};

export default MenuTrigger;
MenuTrigger.displayName = "DropdownMenuTrigger";
