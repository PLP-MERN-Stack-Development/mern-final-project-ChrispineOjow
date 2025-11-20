import { NavigationMenu,NavigationMenuList,NavigationMenuItem,NavigationMenuLink } from "./ui/navigation-menu";
import { Link } from "react-router-dom";
import { Menu } from "lucide-react";
import { Button } from "../components/ui/button";
import { Drawer, DrawerContent, DrawerTrigger, DrawerHeader, DrawerTitle } from "../components/ui/drawer";
import { useState } from "react";
import { UserButton, SignedIn, SignedOut } from "@clerk/clerk-react";


function Navbar(){
    const [isOpen, setIsOpen] = useState(false);

    return(
        <>
            <div className=" flex sticky top-0 z-50">
                <nav className="p-3 border-black w-full bg-black text-white text-2xl  flex  justify-between hover:bg-white-700 hover:text-black-700" >
                    <div className="flex items-center space-x-2">
                        <Link to="/" className="flex items-center">

                            {/* this is where i've placed the logo */}
                            <img src="/water-drop-svgrepo-com.svg" alt="Water Logo" className="h-7 w-auto"/>
                            <span className="text-lg font-bold ml-2">Water Tracker</span>

                        </Link>
                    </div>

                    {/* Desktop Navigation */}
                    <NavigationMenu className="hidden md:flex space-x-7 me-5 ">
                        
                        <NavigationMenuList className="pe-3">

                            <NavigationMenuItem className="rounded transition me-4 duration-200  ease-in-out  hover:bg-white hover:text-black">
                                <NavigationMenuLink asChild>
                                    <Link to="/">Home</Link>
                                </NavigationMenuLink>
                            </NavigationMenuItem>

                            <NavigationMenuItem className="rounded transition me-4  duration-200 ease-in-out hover:bg-white hover:text-black">
                                <NavigationMenuLink asChild>
                                <Link to="/reports">Reports</Link>
                                </NavigationMenuLink>
                            </NavigationMenuItem>

                            <NavigationMenuItem className="rounded transition me-4  duration-200 ease-in-out hover:bg-white hover:text-black">
                                <NavigationMenuLink asChild>
                                <Link to="/addReports">Add Reports</Link>
                                </NavigationMenuLink>
                            </NavigationMenuItem>

                            <SignedOut>
                                <NavigationMenuItem className="rounded transition me-4  duration-200 ease-in-out hover:bg-white hover:text-black">
                                    <NavigationMenuLink asChild>
                                        <Link to="/sign-in">Sign In</Link>
                                    </NavigationMenuLink>
                                </NavigationMenuItem>
                                <NavigationMenuItem className="rounded transition me-4  duration-200 ease-in-out hover:bg-white hover:text-black">
                                    <NavigationMenuLink asChild>
                                        <Link to="/sign-up">Sign Up</Link>
                                    </NavigationMenuLink>
                                </NavigationMenuItem>
                            </SignedOut>

                            <SignedIn>
                                <NavigationMenuItem className="flex items-center me-4">
                                    <UserButton 
                                        afterSignOutUrl="/"
                                        appearance={{
                                            elements: {
                                                avatarBox: "h-8 w-8"
                                            }
                                        }}
                                    />
                                </NavigationMenuItem>
                            </SignedIn>
                            

                        </NavigationMenuList>

                    </NavigationMenu>

                    {/* Mobile Hamburger menu */}

                    <div className="md:hidden flex items-center text-white">
                        <Drawer direction="right">
                            <DrawerTrigger asChild>
                                <Button onClick={() => isOpen ? setIsOpen(false) : setIsOpen(true) } variant="ghost" size="icon" className="text-white">

                                    <Menu className="h-6 w-6"/>

                                </Button>
                            </DrawerTrigger>

                            <DrawerContent side="top" className="bg-black text-white w-[200px] sm:w-[250px] flex flex-col pt-12" >

                                <DrawerHeader> {/* Optional: Use SheetHeader for correct spacing */}
                                    <DrawerTitle/>
                                    
                                </DrawerHeader>

                                <Link to="/" onClick={() => setIsOpen(false)} className="py-2 text-lg font-medium hover:text-blue-600">Home</Link>
                                <Link to="/reports" onClick={() => setIsOpen(false)} className="py-2 text-lg font-medium hover:text-blue-600">Reports</Link>
                                <Link to="/addReports" onClick={() => setIsOpen(false)} className="py-2 text-lg font-medium hover:text-blue-600">Add Reports</Link>

                                
                                <SignedOut>
                                    <Link to="/sign-in" onClick={() => setIsOpen(false)} className="py-2 text-lg font-medium hover:text-blue-600">Sign In</Link>
                                    <Link to="/sign-up" onClick={() => setIsOpen(false)} className="py-2 text-lg font-medium hover:text-blue-600">Sign Up</Link>
                                </SignedOut>
                                
                                <SignedIn>
                                    <div className="py-2 flex items-center">
                                        <UserButton 
                                            afterSignOutUrl="/"
                                            appearance={{
                                                elements: {
                                                    avatarBox: "h-8 w-8"
                                                }
                                            }}
                                        />
                                    </div>
                                </SignedIn>

                            </DrawerContent>
                        </Drawer>

                    </div>
                </nav>
            </div>

        
        </>
    )
}

export default Navbar;