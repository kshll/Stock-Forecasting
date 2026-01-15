import React from 'react';

interface SidebarItem {
  icon: React.ReactNode;
  label: string;
  active?: boolean;
}

interface SidebarProps {
  show: boolean;
  items: SidebarItem[];
}

const Sidebar: React.FC<SidebarProps> = ({ show, items }) => {
  return (
    <div className={`${show ? 'w-56' : 'w-0 md:w-16'} bg-white dark:bg-slate-800 border-r border-slate-200 dark:border-slate-700 transition-all duration-300 overflow-hidden flex flex-col z-10`}>
      <div className="flex-1 py-6">
        <ul className="space-y-2 px-3">
          {items.map((item, index) => (
            <li key={index}>
              <a 
                href="#" 
                className={`flex items-center py-2.5 px-3 rounded-lg transition-colors ${
                  item.active 
                    ? 'bg-sky-50 dark:bg-sky-900/20 text-sky-600 dark:text-sky-400' 
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
                }`}
              >
                <span className="mr-3">{item.icon}</span>
                <span className={`${show ? 'opacity-100' : 'opacity-0 md:opacity-0'} transition-opacity duration-300 font-medium`}>
                  {item.label}
                </span>
              </a>
            </li>
          ))}
        </ul>
      </div>
      
      <div className="px-3 py-4 border-t border-slate-200 dark:border-slate-700">
        <div className={`text-xs text-slate-500 dark:text-slate-400 px-3 mb-3 ${show ? 'block' : 'hidden'}`}>
          App version 1.0.0
        </div>
      </div>
    </div>
  );
};

export default Sidebar;