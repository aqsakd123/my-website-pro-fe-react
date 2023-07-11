import {BookOutlined, CheckSquareOutlined} from "@ant-design/icons";

export const pages = [
    {
        value: 'tech',
        label: 'Technical Stack',
        children: [
            {
                value: 'study',
                url: '/technical/study',
                label: 'Study List',
            },
            {
                value: 'bookmark',
                url: '/technical/bookmark',
                label: 'Bookmark',
            },
            {
                value: 'cheatsheet',
                url: '/technical/cheat',
                label: 'Cheate Sheet',
            },
        ]
    },
    {
        value: 'todo',
        url: '/to-do',
        label: 'To Do List'
    },
];

export const menu = [
    {
        value: 'tech',
        label: 'Technical Stack',
        order: 1,
        icon: <BookOutlined />,
        disabled: true,
        children: [
            {
                value: 'study',
                key: '/technical/study',
                label: 'Study List',
            },
            {
                value: 'bookmark',
                key: '/technical/bookmark',
                label: 'Bookmark',
            },
            {
                value: 'cheatsheet',
                key: '/technical/cheat',
                label: 'Cheate Sheet',
            },
        ]
    },
    {
        value: 'todo',
        label: 'To Do List',
        order: 2,
        key: '/to-do',
        icon: <CheckSquareOutlined />,
    },
];
