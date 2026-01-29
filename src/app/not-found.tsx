import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FileQuestion } from "lucide-react";

export default function NotFound() {
    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6">
            <div className="h-24 w-24 rounded-full bg-primary/10 flex items-center justify-center">
                <FileQuestion className="h-12 w-12 text-primary" />
            </div>
            <div className="space-y-2">
                <h1 className="text-4xl font-extrabold text-gray-900">Page non trouvée</h1>
                <p className="text-gray-500 max-w-md">
                    Désolé, nous n'avons pas pu trouver la page que vous recherchez.
                    Elle a peut-être été déplacée ou supprimée.
                </p>
            </div>
            <Link href="/">
                <Button className="bg-primary text-black hover:bg-primary/90 font-bold">
                    Retour à l'accueil
                </Button>
            </Link>
        </div>
    );
}
