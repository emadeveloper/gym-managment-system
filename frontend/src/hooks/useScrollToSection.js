export const useScrollToSection = () => {
    const scrollTo = (id) => {
        const element = document.getElementById(id);

        if(element) {
            element.scrollIntoView({ behavior: "smooth", block: "start"});
        }
    }
    return { scrollTo };
};