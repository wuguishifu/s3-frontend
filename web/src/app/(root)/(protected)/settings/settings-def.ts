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
        sectionName: 'Buckets',
        links: [
            {
                href: '/settings/aws/configure',
                label: 'Configure AWS',
                highlightFn: (pathname: string) => pathname.startsWith('/settings/aws/configure'),
            },
            {
                href: '/settings/aws/credentials',
                label: 'Credentials',
                highlightFn: (pathname: string) => pathname.startsWith('/settings/aws/credentials'),
            }
        ]
    }

];

export default sections;