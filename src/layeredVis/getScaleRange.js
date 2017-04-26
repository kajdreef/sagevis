export function getScaleRange (listOfThreads) {

    const scaleMax = Math.max(...listOfThreads.map((thread) => {
        
            return thread.getSizeMax();
            
        })),
        scaleMin = Math.min(...listOfThreads.map((thread) => {
            
            return thread.getSizeMin();

        }));

    return {
        "min": scaleMin,
        "max": scaleMax
    };
}
