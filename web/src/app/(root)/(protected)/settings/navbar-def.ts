type Section = {
    links: {
        href: string;
        label: string;
        highlightFn: (pathname: string) => boolean;
    }[];
    sectionName: string;
};

const sections: Section[] = [
    {
        sectionName: 'Account',
        links: [
            {
                href: '/settings/general',
                label: 'General',
                highlightFn: (pathname: string) => pathname.startsWith('/settings/general'),
            }
        ]
    },
    {
        sectionName: 'Buckets',
        links: [
            {
                href: '/settings/aws',
                label: 'Configure AWS',
                highlightFn: (pathname: string) => pathname.startsWith('/settings/aws'),
            }
        ]
    }

];

export default sections;