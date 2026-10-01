'use client';

import { useState, type FC } from 'react';
import { motion, AnimatePresence, MotionConfig } from 'motion/react';
import { FaListUl, FaRegCircle, FaSpinner, FaCheckCircle } from 'react-icons/fa';
import { BsCheckLg } from 'react-icons/bs';
import { PiFunnelSimpleBold } from 'react-icons/pi';
import type { IconType } from 'react-icons';

export interface FilterItem {
  id: string;
  label: string;
  icon: IconType;
}

interface StatusFilterProps {
  items?: FilterItem[];
  defaultActiveId?: string;
  onChange?: (id: string) => void;
}

const SPRING = {
  type: 'spring',
  stiffness: 240,
  damping: 20,
  mass: 1,
} as const;

const STATUS_ITEMS: FilterItem[] = [
  { id: 'ALL', label: 'All', icon: FaListUl },
  { id: 'TODO', label: 'To Do', icon: FaRegCircle },
  { id: 'IN_PROGRESS', label: 'In Progress', icon: FaSpinner },
  { id: 'DONE', label: 'Done', icon: FaCheckCircle },
];

export const StatusFilter: FC<StatusFilterProps> = ({
  items = STATUS_ITEMS,
  defaultActiveId = 'ALL',
  onChange,
}) => {
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(defaultActiveId);

  const activeItem = items.find((i) => i.id === active);
  const ActiveIcon = activeItem ? activeItem.icon : FaListUl;

  const handleSelect = (id: string) => {
    setActive(id);
    onChange?.(id);
    setTimeout(() => setOpen(false), 220);
  };

  return (
    <div className="flex h-[70px] w-[300px] items-center justify-end">
      <MotionConfig
        transition={{
          type: 'spring',
          bounce: 0.25,
          duration: 0.7,
        }}
      >
        <AnimatePresence mode="popLayout" initial={false}>
          {open ? (
            <motion.div
              key="open"
              layoutId="status-filter"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{
                opacity: 0,
                transition: { duration: 0 },
              }}
              style={{ transformOrigin: '50% 100%', borderRadius: 32 }}
              className="absolute z-20 flex w-[300px] flex-col gap-[4px] overflow-hidden rounded-2xl border-[1.6px] border-slate-700 bg-slate-900 p-[8px] shadow-[0_20px_50px_rgba(0,0,0,0.5)] will-change-transform"
            >
              {items.map((item, index) => {
                const Icon = item.icon;
                const selected = active === item.id;

                return (
                  <motion.button
                    key={item.id}
                    initial={{ opacity: 0, scale: 1.1, y: 40 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    onClick={() => handleSelect(item.id)}
                    whileTap={{ scale: 0.98 }}
                    transition={{ ...SPRING, delay: (3 + index) * 0.05 }}
                    className="flex w-full cursor-pointer items-center justify-between rounded-[16px] px-[12px] py-[10px] transition-colors hover:bg-slate-800"
                  >
                    <div className="flex items-center gap-[20px]">
                      <Icon className="h-[22px] w-[22px] text-slate-400" />
                      <span className="text-[16px] font-bold tracking-tight text-slate-200">
                        {item.label}
                      </span>
                    </div>

                    <motion.div
                      animate={{
                        backgroundColor: selected ? '#31C051' : 'rgba(0,0,0,0)',
                      }}
                      className={`flex h-[26px] w-[26px] shrink-0 items-center justify-center rounded-full border-[3px] ${
                        selected ? 'border-[#31C051]' : 'border-slate-600'
                      }`}
                    >
                      <motion.div
                        animate={{
                          scale: selected ? 1 : 0,
                          opacity: selected ? 1 : 0,
                        }}
                        transition={{
                          type: 'spring',
                          stiffness: 520,
                          damping: 30,
                        }}
                      >
                        <BsCheckLg className="h-[16px] w-[16px] text-white" />
                      </motion.div>
                    </motion.div>
                  </motion.button>
                );
              })}
            </motion.div>
          ) : (
            <div key="close" className="flex items-center">
              <motion.button
                layoutId="status-filter"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{
                  opacity: 0,
                  transition: { duration: 0 },
                }}
                onClick={() => setOpen(true)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                style={{ borderRadius: 32 }}
                className="z-30 flex h-[48px] w-[48px] cursor-pointer items-center justify-center rounded-full border-[1.6px] border-slate-700 bg-slate-800 will-change-transform"
              >
                <PiFunnelSimpleBold className="h-[22px] w-[22px] text-slate-100" />
              </motion.button>

              <motion.div
                initial={{ x: -30 }}
                animate={{ x: 0 }}
                transition={{
                  type: 'spring',
                  bounce: 0,
                  duration: 1.2,
                }}
                className="z-10 -ml-[10px] flex h-[48px] w-[48px] items-center justify-center rounded-full border-[1.6px] border-slate-700 bg-slate-800 opacity-80"
              >
                <AnimatePresence mode="popLayout" initial={false}>
                  <motion.div
                    key={active}
                    initial={{ opacity: 0, scale: 0.6 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.6 }}
                  >
                    <ActiveIcon className="h-[20px] w-[20px] text-slate-300" />
                  </motion.div>
                </AnimatePresence>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </MotionConfig>
    </div>
  );
};

export default StatusFilter;